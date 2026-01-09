use bolt_lang::*;
use game_session::GameSession;

declare_id!("JoInGame11111111111111111111111111111111111");

#[system]
pub mod system_join_game {
    pub fn execute(ctx: Context<Components>, args: Args) -> Result<Components> {
        // Check if game is waiting for player 2
        require!(
            ctx.accounts.game_session.game_status == GameSession::STATUS_WAITING,
            GameError::GameNotAvailable
        );
        
        // Check if player 2 slot is empty
        require!(
            ctx.accounts.game_session.player2 == Pubkey::default(),
            GameError::GameFull
        );
        
        // For private games, verify invite code
        if ctx.accounts.game_session.game_mode == GameSession::MODE_PRIVATE {
            require!(
                args.invite_code == ctx.accounts.game_session.invite_code,
                GameError::InvalidInviteCode
            );
        }
        
        // Assign player 2
        ctx.accounts.game_session.player2 = *ctx.accounts.player.key;
        
        msg!("Player 2 joined game: {}", ctx.accounts.game_session.game_id);
        msg!("Player 1: {}", ctx.accounts.game_session.player1);
        msg!("Player 2: {}", ctx.accounts.game_session.player2);
        
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub game_session: GameSession,
    }

    #[arguments]
    pub struct Args {
        pub invite_code: u64,
    }
    
    #[extra_accounts]
    pub struct ExtraAccounts {
        #[account(mut)]
        pub player: Signer,
    }
}

#[error_code]
pub enum GameError {
    #[msg("Game is not available to join")]
    GameNotAvailable,
    #[msg("Game is already full")]
    GameFull,
    #[msg("Invalid invite code")]
    InvalidInviteCode,
}
