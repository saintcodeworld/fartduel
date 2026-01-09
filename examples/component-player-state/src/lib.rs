use bolt_lang::*;

declare_id!("PLaYerState11111111111111111111111111111111");

#[component]
#[derive(Default)]
pub struct PlayerState {
    pub player_address: Pubkey,
    pub game_id: u64,
    pub selected_number: u8,
    pub has_selected: bool,
    pub has_paid: bool,
    pub distance_from_target: u8,
    pub is_winner: bool,
}
