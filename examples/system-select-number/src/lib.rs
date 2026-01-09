use bolt_lang::*;
use game_session::GameSession;
use player_state::PlayerState;

declare_id!("SeLectNumber1111111111111111111111111111111");

#[system]
pub mod system_select_number {
    pub fn execute(ctx: Context<Components>, args: Args) -> Result<Components> {
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        
        // Validate number is between 1-100
        require!(
            args.selected_number >= 1 && args.selected_number <= 100,
            GameError::InvalidNumber
        );
        
        // Check if game is in correct state
        require!(
            ctx.accounts.game_session.game_status == GameSession::STATUS_WAITING ||
            ctx.accounts.game_session.game_status == GameSession::STATUS_SELECTING,
            GameError::InvalidGameState
        );
        
        // Check if player is part of this game
        let player_key = *ctx.accounts.player.key;
        let is_player1 = ctx.accounts.game_session.player1 == player_key;
        let is_player2 = ctx.accounts.game_session.player2 == player_key;
        
        require!(is_player1 || is_player2, GameError::NotInGame);
        
        // Check if player already selected
        require!(!ctx.accounts.player_state.has_selected, GameError::AlreadySelected);
        
        // If this is the first selection, set deadline and update status
        if ctx.accounts.game_session.game_status == GameSession::STATUS_WAITING {
            ctx.accounts.game_session.selection_deadline = current_time + 25; // 25 seconds
            ctx.accounts.game_session.game_status = GameSession::STATUS_SELECTING;
        }
        
        // Check if selection deadline has passed
        if ctx.accounts.game_session.selection_deadline > 0 {
            require!(
                current_time <= ctx.accounts.game_session.selection_deadline,
                GameError::SelectionDeadlinePassed
            );
        }
        
        // Transfer entry fee from player to game escrow
        let cpi_accounts = system_program::Transfer {
            from: ctx.accounts.player.clone(),
            to: ctx.accounts.game_escrow.clone(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.system_program.clone(), cpi_accounts);
        system_program::transfer(cpi_ctx, ctx.accounts.game_session.entry_fee)?;
        
        // Update player state
        ctx.accounts.player_state.player_address = player_key;
        ctx.accounts.player_state.game_id = ctx.accounts.game_session.game_id;
        ctx.accounts.player_state.selected_number = args.selected_number;
        ctx.accounts.player_state.has_selected = true;
        ctx.accounts.player_state.has_paid = true;
        
        // Update prize pool
        ctx.accounts.game_session.prize_pool += ctx.accounts.game_session.entry_fee;
        
        msg!("Player {} selected number: {}", player_key, args.selected_number);
        msg!("Prize pool now: {} lamports", ctx.accounts.game_session.prize_pool);
        
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub game_session: GameSession,
        pub player_state: PlayerState,
    }

    #[arguments]
    pub struct Args {
        pub selected_number: u8,
    }
    
    #[extra_accounts]
    pub struct ExtraAccounts {
        #[account(mut)]
        pub player: Signer,
        #[account(mut)]
        pub game_escrow: AccountInfo,
        #[account(address = bolt_lang::solana_program::system_program::id())]
        pub system_program: AccountInfo,
    }
}

#[error_code]
pub enum GameError {
    #[msg("Number must be between 1 and 100")]
    InvalidNumber,
    #[msg("Game is not in the correct state")]
    InvalidGameState,
    #[msg("You are not part of this game")]
    NotInGame,
    #[msg("You have already selected a number")]
    AlreadySelected,
    #[msg("Selection deadline has passed")]
    SelectionDeadlinePassed,
}
