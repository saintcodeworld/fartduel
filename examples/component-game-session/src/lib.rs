use bolt_lang::*;

declare_id!("GaMeSession11111111111111111111111111111111");

#[component]
#[derive(Default)]
pub struct GameSession {
    pub game_id: u64,
    pub player1: Pubkey,
    pub player2: Pubkey,
    pub entry_fee: u64,
    pub prize_pool: u64,
    pub target_number: u8,
    pub game_status: u8,
    pub game_mode: u8,
    pub created_at: i64,
    pub selection_deadline: i64,
    pub invite_code: u64,
}

impl GameSession {
    pub const STATUS_WAITING: u8 = 0;
    pub const STATUS_SELECTING: u8 = 1;
    pub const STATUS_REVEALING: u8 = 2;
    pub const STATUS_COMPLETED: u8 = 3;
    pub const STATUS_TIE: u8 = 4;
    
    pub const MODE_PUBLIC: u8 = 0;
    pub const MODE_PRIVATE: u8 = 1;
}
