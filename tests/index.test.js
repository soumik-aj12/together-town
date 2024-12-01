const axios2 = require("axios");

const axios = {
  post: async (...args) => {
    try {
      const res = await axios2.post(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  get: async (...args) => {
    try {
      const res = await axios2.get(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  put: async (...args) => {
    try {
      const res = await axios2.put(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  delete: async (...args) => {
    try {
      const res = await axios2.delete(...args);
      return res;
    } catch (error) {
      return error.response;
    }
  },
};
const BACKEND_URL = "http://localhost:8000";
// describe('Authentication', () => {
//     //Signup
//     test('Unique User Registration - Email', async () => {
//         const user1 = { username: "testadmin1", email: 'testadmin1@gmail.com', password: 'testpassword', role: "admin" };
//         const response1 = await axios.post(`${BACKEND_URL}/api/signup`, user1);
//         expect(response1.status).toBe(200);

//         const user2 = { username: "testadmin2", email: 'testadmin1@gmail.com', password: 'testpassword2',role: "admin"};
//         const response2 = await axios.post(`${BACKEND_URL}/api/signup`, user2);
//         expect(response2.status).toBe(400);
//      });
//      test('Unique User Registration - Username', async () => {
//         const name = "testadmin"+Math.random();
//         const user1 = { username: name, email: 'testadmin2@gmail.com', password: 'testpassword', role: "admin" };
//         const response1 = await axios.post(`${BACKEND_URL}/api/signup`, user1);
//         expect(response1.status).toBe(200);
//         const user2 = { username: name, email: 'testadmin2@gmail.com', password: 'testpassword',role: "admin"};
//         const response2 = await axios.post(`${BACKEND_URL}/api/signup`, user2);
//         expect(response2.status).toBe(400);
//      });
//      test('Email not provided', async () => {
//         const user = { username: "testadmin"+Math.random(), password: 'testpassword2', role: "admin"};
//         const response2 = await axios.post(`${BACKEND_URL}/api/signup`, user);
//         expect(response2.status).toBe(400);
//      });
//      test('Username not provided', async () => {
//         const user = { email: "testadmin3@gmail.com", password: 'testpassword2', role: "admin"};
//         const response2 = await axios.post(`${BACKEND_URL}/api/signup`, user);
//         expect(response2.status).toBe(400);
//      });
//      test('Password not provided', async () => {
//         const user = { email: "testadmin3@gmail.com", password: 'testpassword2', role: "admin"};
//         const response2 = await axios.post(`${BACKEND_URL}/api/signup`, user);
//         expect(response2.status).toBe(400);
//      });

//      //Signin
//      test('Valid Email', async () => {
//         const user1 = { email: "testadmin1@gmail.com", password: 'testpassword', role: "admin"};
//         const response1 = await axios.post(`${BACKEND_URL}/api/signin`, user1);
//         expect(response1.status).toBe(200);

//         const user2 = { email: "testadmin3223@gmail.com", password: 'testpassword', role: "admin"};
//         const response2 = await axios.post(`${BACKEND_URL}/api/signin`, user2);
//         expect(response2.status).toBe(400);

//      });

//      test('Valid Password', async () => {
//         const user1 = { email: "testadmin1@gmail.com", password: 'testpassword', role: "admin"};
//         const response1 = await axios.post(`${BACKEND_URL}/api/signin`, user1);
//         expect(response1.status).toBe(200);

//         const user2 = { email: "testadmin3223@gmail.com", password: 'testpasswordsnjsdj', role: "admin"};
//         const response2 = await axios.post(`${BACKEND_URL}/api/signin`, user2);
//         expect(response2.status).toBe(400);

//      })

//      test('Valid Password', async () => {
//       const user1 = { email: "testadmin1@gmail.com", password: 'testpassword', role: "admin"};
//       const response1 = await axios.post(`${BACKEND_URL}/api/signin`, user1);
//       expect(response1.status).toBe(200);

//       // const user2 = { email: "testadmin1@gmail.com", password: 'testpassword', role: "user"};
//       // const response2 = await axios.post('${BACKEND_URL}/api/signin', user2);
//       // expect(response2.status).toBe(200);

//       const user3 = { email: "testadmin1@gmail.com", password: 'testpassword', role: "asdsd"};
//       const response3 = await axios.post(`${BACKEND_URL}/api/signin`, user3);
//       expect(response3.status).toBe(400);

//    })
//  });

describe("User metadata endpoint", () => {
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const randomNum = Math.round(Math.random() * 1000);
    const username = `testadmin${randomNum}`;
    const email = `testadmin${randomNum}@gmail.com`;
    const password = "1234";

    await axios.post(`${BACKEND_URL}/api/signup`, {
      email,
      username,
      password,
      role: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/signin`, {
      email,
      password,
      role: "admin",
    });

    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Sam",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("avatarresponse is " + avatarResponse.data.id);

    avatarId = avatarResponse.data.id;
  });

  test("User can't update their avatar with a wrong avatar id", async () => {
   
    const response = await axios.post(
      `${BACKEND_URL}/api/user/metadata`,
      {
        avatarId: "36363",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(400);
  });

  test("User can update their metadata with the right avatar id", async () => {
      console.log("Token inside 2nd test", token);
   console.log("AvatarID inside 2nd test", avatarId);
    const response = await axios.post(
      `${BACKEND_URL}/api/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
   console.log(response.data);

    expect(response.status).toBe(200);
  });

  test("User is not able to update their metadata if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/user/metadata`, {
      avatarId,
    });

    expect(response.status).toBe(401);
  });
});
