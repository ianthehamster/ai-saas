import axios from 'axios';

export const getApiLimitCount = async (userEmail: string) => {
  const loggedInUser = await axios.get(
    `http://localhost:3001/users/email?email=${userEmail}`,
  );
  console.log(loggedInUser);

  if (!loggedInUser) {
    return 0;
  }
};

// export const increaseApiCountAfterGeneration = async
