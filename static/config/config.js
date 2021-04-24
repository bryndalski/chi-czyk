export let config = {
  //połączenia
  API: "apiAdressHere",
  register_adress: "http://localhost:5500/test__UNUSED",
  ask_for_room: "/askForRoom",
  fetchWaitingRoom: "/nowiLudzie",
  changePlay: "/zmianaNastawienia",
  getUsers: "/GetUsers",
  gameSynch: "/gameSynch",
  // "getBord": "/getBord",
  getPawns: "/pawnPosition",
  dice: "throwDice", //Do rzucania kostką
  //nowy ruch
  newMove: "newMove",
  sendToBase:"sendToBase",
  //content type
  contentTypes: {
    json: "application/json",
  },

  //kolory planszy
};
//! dodaj na swerwerze całą obsługę
