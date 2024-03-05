//It will return the other user which id is not matching with current login in user id
export const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1]: users[0];
  };