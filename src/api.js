import axios from 'axios';

export const REACT_APP_BACKEND_URL = 'http://localhost:5000';

// Destructure and convert python naming convention to JSON.
export const boardApiToJson = (board) => {
  const { board_id: boardId, title, owner } = board;
  return { boardId, title, owner };
};

// Destructure and convert Card to Json
export const cardApiToJson = (card) => {
  const {
    card_id: cardId,
    board_id: boardId,
    likes_count: likesCount,
    message
    
  } = card;
  return { cardId, boardId, likesCount, message };
};

// Post Board Object {"title": "", "owner": ""} This is used in OnSubmitFormBoard, to submit the Board when clicking the button
export const addBoardAPI = (board) => {
  return (
    axios.post(`${REACT_APP_BACKEND_URL}/boards`, board)
      .then((response) => boardApiToJson(response.data.board))
      //need show the user a greyed out submit button
      .catch((err) => console.log(err))
  );
};

// Post Card Obj {"message":""}
export const addCardAPI = (card, boardId) => {
  return axios
    .post(`${REACT_APP_BACKEND_URL}/boards/${boardId}/cards`, card)
    .then((response) => {
      console.log(response.data.cards)
      return response.data.cards.map((card)=>{
        return cardApiToJson({...card,board_id: boardId})
      });
    })
    .catch((err) => console.log(err));
};

//This doesn't add the boardId like above because I changed the CARD MODEL in the backend to include the board id. This commented out function is saner, if the backend is done correct. Otherwise use the above to add an key value pair to an object.

// export const addCardAPI = (card, boardId) => {
//   return axios
//     .post(`${REACT_APP_BACKEND_URL}/boards/${boardId}/cards`, card)
//     .then((response) => {
//       
//       return response.data.cards.map((card)=>{
//         return cardApiToJson(cards)
//       });
//     })
//     .catch((err) => console.log(err));
// };

// Get ALL Boards, the promise returned is the servers response of the data, [ Board1, Board2, Board3 ]
export const getBoardsAPI = async () => {
  try {
    const response = await axios.get(`${REACT_APP_BACKEND_URL}/boards`);
    return response.data.map(boardApiToJson);
  } catch (err) {
    console.log(err);
    throw new Error('Can not get your boards!');
  }
};

//Get Cards from API
export const getCardsAPI = async (boardId) => {
  try {
    const response = await axios.get(
      `${REACT_APP_BACKEND_URL}/boards/${boardId}/cards`
    );
    return response.data.map(cardApiToJson);
  } catch (err) {
    console.log(err);
    throw new Error('Nope, can not get your cards');
  }
};

// Delete a Board from the API, this goes into the onClick that deletes the board
export const deleteBoardAPI = async (boardId) => {
  try {
    await axios.delete(`${REACT_APP_BACKEND_URL}/boards/${boardId}`);
  } catch (error) {
    console.log(error);
    throw new Error(`Could not delete your ${boardId}.`);
  }
};

export const deleteCardAPI = async (cardId) => {
  try {
    await axios.delete(`${REACT_APP_BACKEND_URL}/cards/${cardId}`);
  } catch (error) {
    console.log(error);
    throw new Error(`Could not delete card ${cardId}.`);
  }
};