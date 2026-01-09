use bolt_lang::*;
use game_session::GameSession;
use player_state::PlayerState;

declare_id!("ReVealWinner111111111111111111111111111111");

#[system]
pub mod system_reveal_winner {
    pub fn execute(ctx: Context<Components>, _args: Args) -> Result<Components> {
        // Verify game is in revealing state
        require!(
            ctx.accounts.game_session.game_status == GameSession::STATUS_SELECTING ||
            ctx.accounts.game_session.game_status == GameSession::STATUS_REVEALING,
            GameError::InvalidGameState
        );
        
        // Verify both players have selected
        require!(
            ctx.accounts.player1_state.has_selected && ctx.accounts.player2_state.has_selected,
            GameError::NotAllPlayersSelected
        );
        
        // Update game status to revealing
        ctx.accounts.game_session.game_status = GameSession::STATUS_REVEALING;
        
        // Calculate distances from target
        let target = ctx.accounts.game_session.target_number;
        let p1_number = ctx.accounts.player1_state.selected_number;
        let p2_number = ctx.accounts.player2_state.selected_number;
        
        let p1_distance = if p1_number > target {
            p1_number - target
        } else {
            target - p1_number
        };
        
        let p2_distance = if p2_number > target {
            p2_number - target
        } else {
            target - p2_number
        };
        
        ctx.accounts.player1_state.distance_from_target = p1_distance;
        ctx.accounts.player2_state.distance_from_target = p2_distance;
        
        // Determine winner
        let (winner_key, loser_key) = if p1_distance < p2_distance {
            ctx.accounts.player1_state.is_winner = true;
            ctx.accounts.player2_state.is_winner = false;
            (ctx.accounts.game_session.player1, ctx.accounts.game_session.player2)
        } else if p2_distance < p1_distance {
            ctx.accounts.player1_state.is_winner = false;
            ctx.accounts.player2_state.is_winner = true;
            (ctx.accounts.game_session.player2, ctx.accounts.game_session.player1)
        } else {
            // Tie - set status and return
            ctx.accounts.game_session.game_status = GameSession::STATUS_TIE;
            msg!("Game ended in a tie! Target: {}, P1: {}, P2: {}", target, p1_number, p2_number);
            return Ok(ctx.accounts);
        };
        
        // Calculate prize distribution
        let total_pool = ctx.accounts.game_session.prize_pool;
        let platform_fee = (total_pool * 2) / 100; // 2% platform fee
        let winner_prize = total_pool - platform_fee;
        
        // Transfer winner prize from escrow to winner
        **ctx.accounts.game_escrow.try_borrow_mut_lamports()? -= winner_prize;
        **ctx.accounts.winner.try_borrow_mut_lamports()? += winner_prize;
        
        // Transfer platform fee to platform wallet
        **ctx.accounts.game_escrow.try_borrow_mut_lamports()? -= platform_fee;
        **ctx.accounts.platform_wallet.try_borrow_mut_lamports()? += platform_fee;
        
        // Update game status
        ctx.accounts.game_session.game_status = GameSession::STATUS_COMPLETED;
        
        msg!("Game completed!");
        msg!("Target number: {}", target);
        msg!("Player 1 selected: {} (distance: {})", p1_number, p1_distance);
        msg!("Player 2 selected: {} (distance: {})", p2_number, p2_distance);
        msg!("Winner: {}", winner_key);
        msg!("Winner prize: {} lamports", winner_prize);
        msg!("Platform fee: {} lamports", platform_fee);
        
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub game_session: GameSession,
        pub player1_state: PlayerState,
        pub player2_state: PlayerState,
    }

    #[arguments]
    pub struct Args {}
    
    #[extra_accounts]
    pub struct ExtraAccounts {
        #[account(mut)]
        pub game_escrow: AccountInfo,
        #[account(mut)]
        pub winner: AccountInfo,
        #[account(mut)]
        pub platform_wallet: AccountInfo,
    }
}

#[error_code]
pub enum GameError {
    #[msg("Game is not in the correct state")]
    InvalidGameState,
    #[msg("Not all players have selected their numbers")]
    NotAllPlayersSelected,
}
