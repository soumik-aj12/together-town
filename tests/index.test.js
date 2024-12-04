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

// describe("User metadata endpoint", () => {
//   let token = "";
//   let avatarId = "";

//   beforeAll(async () => {
//     const randomNum = Math.round(Math.random() * 1000);
//     const username = `testadmin${randomNum}`;
//     const email = `testadmin${randomNum}@gmail.com`;
//     const password = "1234";

//     await axios.post(`${BACKEND_URL}/api/signup`, {
//       email,
//       username,
//       password,
//       role: "admin",
//     });

//     const response = await axios.post(`${BACKEND_URL}/api/signin`, {
//       email,
//       password,
//       role: "admin",
//     });

//     token = response.data.token;

//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Sam",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     console.log("avatarresponse is " + avatarResponse.data.id);

//     avatarId = avatarResponse.data.id;
//   });

//   test("User can't update their avatar with a wrong avatar id", async () => {

//     const response = await axios.post(
//       `${BACKEND_URL}/api/user/metadata`,
//       {
//         avatarId: "36363",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     expect(response.status).toBe(400);
//   });

//   test("User can update their metadata with the right avatar id", async () => {
//       console.log("Token inside 2nd test", token);
//    console.log("AvatarID inside 2nd test", avatarId);
//     const response = await axios.post(
//       `${BACKEND_URL}/api/user/metadata`,
//       {
//         avatarId,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );
//    console.log(response.data);

//     expect(response.status).toBe(200);
//   });

//   test("User is not able to update their metadata if the auth header is not present", async () => {
//     const response = await axios.post(`${BACKEND_URL}/api/user/metadata`, {
//       avatarId,
//     });

//     expect(response.status).toBe(401);
//   });
// });

// describe("Avatar", () => {
//   let avatarId;
//   let token;
//   let userId;

//   beforeAll(async () => {
//     const randomNum = Math.round(Math.random() * 1000);
//     const username = `testadmin${randomNum}`;
//     const email = `testadmin${randomNum}@gmail.com`;
//     const password = "1234";

//     const signupResponse = await axios.post(`${BACKEND_URL}/api/signup`, {
//       email,
//       username,
//       password,
//       role: "admin",
//     });

//     const response = await axios.post(`${BACKEND_URL}/api/signin`, {
//       email,
//       password,
//       role: "admin",
//     });

//     token = response.data.token;
//     userId = signupResponse.data.userId;

//     const avatarResponse = await axios.post(
//       `${BACKEND_URL}/api/admin/avatar`,
//       {
//         imageUrl:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//         name: "Sam",
//       },
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     avatarId = avatarResponse.data.avatarId;
//   });

//   test("Get back avatar information for a user", async () => {
//     console.log("asking for user with id " + userId);
//     const response = await axios.get(
//       `${BACKEND_URL}/api/user/metadata/bulk?userIds=[${userId}]`
//     );
//     console.log("response was " + userId);
//     console.log(JSON.stringify(response.data));
//     expect(response.data.data.length).toBe(1);
//     expect(response.data.data[0].userId).toBe(userId);
//   });

//   test("Available avatars lists the recently created avatar", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/avatars`);
//     console.log(response.data);

//     expect(response.data.avatars.length).not.toBe(0);
//     const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
//     expect(currentAvatar).toBeDefined();
//   });
// });

describe("Space", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;
  let spaceId;
  beforeAll(async () => {
    const randomNum = Math.round(Math.random() * 1000);
    const adminUsername = `testadmin${randomNum}`;
    const adminEmail = `testadmin${randomNum}@gmail.com`;
    const userUsername = `testuser${randomNum}`;
    const userEmail = `testuser${randomNum}@gmail.com`;
    const password = "1234";

    const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/signup`, {
      email: adminEmail,
      username: adminUsername,
      password,
      role: "admin",
    });

    const adminSignInResponse = await axios.post(`${BACKEND_URL}/api/signin`, {
      email: adminEmail,
      password,
      role: "admin",
    });

    adminToken = adminSignInResponse.data.token;
    adminId = adminSignupResponse.data.userId;
    console.log(adminToken, adminId);

    const userSignupResponse = await axios.post(`${BACKEND_URL}/api/signup`, {
      email: userEmail,
      username: userUsername,
      password,
      role: "user",
    });

    const userSigninResponse = await axios.post(`${BACKEND_URL}/api/signin`, {
      email: userEmail,
      password,
      role: "user",
    });
    userToken = userSigninResponse.data.token;
    userId = userSignupResponse.data.userId;
    console.log(userToken, userId);

    const element1Response = await axios.post(
      `${BACKEND_URL}/api/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2Response = await axios.post(
      `${BACKEND_URL}/api/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "Default space",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.data.id;
    console.log(mapId);
  });
  test("User is able to create a space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.status).toBe(200);
    expect(response.data.spaceId).toBeDefined();
  });
  test("User is not able to create a space without mapId and dimensions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/space`,
      {
        name: "Test",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.status).toBe(400);
  });
  test("User is able to create a space without mapId (empty space)", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.data.spaceId).toBeDefined();
  });

  test("User is not able to delete a space that doesnt exist", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/space/randomIdDoesntExist`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.status).toBe(400);
  });

  test("User is able to delete a space that the user just created", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    console.log(response.data);

    const deleteReponse = await axios.delete(
      `${BACKEND_URL}/api/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(deleteReponse.status).toBe(200);
  });

  test("User should not be able to delete a space created by another user", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteReponse = await axios.delete(
      `${BACKEND_URL}/api/space/${response.data.spaceId}`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(deleteReponse.status).toBe(403);
  });

  test("Admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    expect(response.data.spaces.length).toBe(0);
  });

  test("Admin creates and gets a space successfully", async () => {
    const spaceCreateReponse = await axios.post(
      `${BACKEND_URL}/api/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    console.log("jhflksdjflksdfjlksdfj");
    console.log(spaceCreateReponse.data);
    const response = await axios.get(`${BACKEND_URL}/api/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    const filteredSpace = response.data.spaces.find(
      (x) => x.id == spaceCreateReponse.data.spaceId
    );
    expect(response.data.spaces.length).toBe(1);
    expect(filteredSpace).toBeDefined();
  });
});

// const spaceResponse = await axios.post(
//   `${BACKEND_URL}/api/space`,
//   {
//     name: "Test",
//     dimensions: "100x200",
//     mapId: mapId,
//   },
//   {
//     headers: {
//       authorization: `Bearer ${adminToken}`,
//     },
//   }
// );
// console.log(spaceResponse.data);
// spaceId = spaceResponse.data.spaceId;
// test("Incorrect spaceId returns a 400", async () => {
//   const response = await axios.get(`${BACKEND_URL}/api/space/123kasdk01`, {
//     headers: {
//       authorization: `Bearer ${userToken}`,
//     },
//   });
//   expect(response.status).toBe(400);
// });
// test("Correct spaceId returns all the elements", async () => {
//   const response = await axios.get(`${BACKEND_URL}/api/space/${spaceId}`, {
//     headers: {
//       authorization: `Bearer ${userToken}`,
//     },
//   });
//   console.log(response.data);
//   expect(response.data.data.dimensions).toBe("100x200");
//   expect(response.data.data.lements.length).toBe(3);
// });
