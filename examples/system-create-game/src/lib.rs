use bolt_lang::*;
use game_session::GameSession;

declare_id!("CrEateGame111111111111111111111111111111111");

#[system]
pub mod system_create_game {
    pub fn execute(ctx: Context<Components>, args: Args) -> Result<Components> {
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        
        // Validate entry fee range (0.015 SOL to 100 SOL)
        let min_fee = 15_000_000; // 0.015 SOL in lamports
        let max_fee = 100_000_000_000; // 100 SOL in lamports
        require!(
            args.entry_fee >= min_fee && args.entry_fee <= max_fee,
            GameError::InvalidEntryFee
        );
        
        // Generate random target number (1-100) using slot hash
        let slot = clock.slot;
        let random_seed = slot.wrapping_mul(current_time as u64);
        let target_number = ((random_seed % 100) + 1) as u8;
        
        // Initialize game session
        ctx.accounts.game_session.game_id = args.game_id;
        ctx.accounts.game_session.player1 = *ctx.accounts.authority.key;
        ctx.accounts.game_session.entry_fee = args.entry_fee;
        ctx.accounts.game_session.prize_pool = 0;
        ctx.accounts.game_session.target_number = target_number;
        ctx.accounts.game_session.game_status = GameSession::STATUS_WAITING;
        ctx.accounts.game_session.game_mode = args.game_mode;
        ctx.accounts.game_session.created_at = current_time;
        ctx.accounts.game_session.selection_deadline = 0;
        ctx.accounts.game_session.invite_code = args.invite_code;
        
        msg!("Game created with ID: {}", args.game_id);
        msg!("Entry fee: {} lamports", args.entry_fee);
        msg!("Game mode: {}", if args.game_mode == 0 { "Public" } else { "Private" });
        
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub game_session: GameSession,
    }

    #[arguments]
    pub struct Args {
        pub game_id: u64,
        pub entry_fee: u64,
        pub game_mode: u8,
        pub invite_code: u64,
    }
    
    #[extra_accounts]
    pub struct ExtraAccounts {
        #[account(mut)]
        pub authority: Signer,
    }
}

#[error_code]
pub enum GameError {
    #[msg("Entry fee must be between 0.015 and 100 SOL")]
    InvalidEntryFee,
}
