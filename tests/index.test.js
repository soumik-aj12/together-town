const axios2 = require("axios");
const WebSocket = require("ws");
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
const WS_URL = "ws://localhost:8080"

describe('Authentication', () => {
    //Signup
    test('Unique User Registration - Email', async () => {
        const user1 = { username: "testadmin1", email: 'testadmin1@gmail.com', password: 'testpassword', role: "admin" };
        const response1 = await axios.post(`${BACKEND_URL}/api/signup`, user1);
        expect(response1.status).toBe(200);

        const user2 = { username: "testadmin2", email: 'testadmin1@gmail.com', password: 'testpassword2',role: "admin"};
        const response2 = await axios.post(`${BACKEND_URL}/api/signup`, user2);
        expect(response2.status).toBe(400);
     });
     test('Unique User Registration - Username', async () => {
        const name = "testadmin"+Math.random();
        const user1 = { username: name, email: 'testadmin2@gmail.com', password: 'testpassword', role: "admin" };
        const response1 = await axios.post(`${BACKEND_URL}/api/signup`, user1);
        expect(response1.status).toBe(200);
        const user2 = { username: name, email: 'testadmin2@gmail.com', password: 'testpassword',role: "admin"};
        const response2 = await axios.post(`${BACKEND_URL}/api/signup`, user2);
        expect(response2.status).toBe(400);
     });
     test('Email not provided', async () => {
        const user = { username: "testadmin"+Math.random(), password: 'testpassword2', role: "admin"};
        const response2 = await axios.post(`${BACKEND_URL}/api/signup`, user);
        expect(response2.status).toBe(400);
     });
     test('Username not provided', async () => {
        const user = { email: "testadmin3@gmail.com", password: 'testpassword2', role: "admin"};
        const response2 = await axios.post(`${BACKEND_URL}/api/signup`, user);
        expect(response2.status).toBe(400);
     });
     test('Password not provided', async () => {
        const user = { email: "testadmin3@gmail.com", password: 'testpassword2', role: "admin"};
        const response2 = await axios.post(`${BACKEND_URL}/api/signup`, user);
        expect(response2.status).toBe(400);
     });

     //Signin
     test('Valid Email', async () => {
        const user1 = { email: "testadmin1@gmail.com", password: 'testpassword'};
        const response1 = await axios.post(`${BACKEND_URL}/api/signin`, user1);
        expect(response1.status).toBe(200);

        const user2 = { email: "testadmin3223@gmail.com", password: 'testpassword'};
        const response2 = await axios.post(`${BACKEND_URL}/api/signin`, user2);
        expect(response2.status).toBe(400);

     });

     test('Valid Password', async () => {
        const user1 = { email: "testadmin1@gmail.com", password: 'testpassword'};
        const response1 = await axios.post(`${BACKEND_URL}/api/signin`, user1);
        expect(response1.status).toBe(200);

        const user2 = { email: "testadmin3223@gmail.com", password: 'testpasswordsnjsdj'};
        const response2 = await axios.post(`${BACKEND_URL}/api/signin`, user2);
        expect(response2.status).toBe(400);

     })

 });

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

describe("Avatar", () => {
  let avatarId;
  let token;
  let userId;

  beforeAll(async () => {
    const randomNum = Math.round(Math.random() * 1000);
    const username = `testadmin${randomNum}`;
    const email = `testadmin${randomNum}@gmail.com`;
    const password = "1234";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/signup`, {
      email,
      username,
      password,
      role: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/signin`, {
      email,
      password,
    });

    token = response.data.token;
    userId = signupResponse.data.userId;

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

    avatarId = avatarResponse.data.avatarId;
  });

  test("Get back avatar information for a user", async () => {
    console.log("asking for user with id " + userId);
    const response = await axios.get(
      `${BACKEND_URL}/api/user/metadata/bulk?userIds=[${userId}]`
    );
    console.log("response was " + userId);
    console.log(JSON.stringify(response.data));
    expect(response.data.data.length).toBe(1);
    expect(response.data.data[0].userId).toBe(userId);
  });

  test("Available avatars lists the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/avatars`);
    console.log(response.data);

    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

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

describe("Arena endpoints", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;
  let spaceId;

  beforeAll(async () => {
    const randomNum = Math.round(Math.random() * 10000);
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

    const spaceResponse = await axios.post(
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
    console.log(spaceResponse.data);
    spaceId = spaceResponse.data.spaceId;
  });

  test("Incorrect spaceId returns a 400", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/space/randomspaceId`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(response.status).toBe(400);
  });

  test("Correct spaceId returns all the elements", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    console.log(response.data);
    expect(response.data.data.dimensions).toBe("100x200");
    expect(response.data.data.elements.length).toBe(3);
  });

  test("Delete endpoint is able to delete an element", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    // console.log("Delete endpoint first resp",response.data);
    console.log(response.data.data.elements[0]);
    let res = await axios.delete(`${BACKEND_URL}/api/space/element`, {
      data: { id: response.data.data.elements[0].id },
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    console.log(res.status);

    const newResponse = await axios.get(`${BACKEND_URL}/api/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    expect(newResponse.data.data.elements.length).toBe(2);
  });

  test("Adding an element fails if the element lies outside the dimensions", async () => {
    const newResponse = await axios.post(
      `${BACKEND_URL}/api/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 10000,
        y: 210000,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(newResponse.status).toBe(400);
  });

  test("Adding an element works as expected", async () => {
    await axios.post(
      `${BACKEND_URL}/api/space/element`,
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 50,
        y: 20,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const newResponse = await axios.get(`${BACKEND_URL}/api/space/${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });
    expect(newResponse.data.data.elements.length).toBe(3);
  });
});

describe("Admin Endpoints", () => {
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  beforeAll(async () => {
    const randomNum = Math.round(Math.random() * 10000);
    const username = `testadmin${randomNum}`;
    const userUsername = `testuser${randomNum}`;
    const email = `testadmin${randomNum}@gmail.com`;
    const userEmail = `testuser${randomNum}@gmail.com`;
    const password = "1234";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/signup`, {
      username,
      email,
      password,
      role: "admin",
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/signin`, {
      email,
      password,
    });

    adminToken = response.data.token;

    const userSignupResponse = await axios.post(`${BACKEND_URL}/api/signup`, {
      username: userUsername,
      email: userEmail,
      password,
      role: "user",
    });

    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(`${BACKEND_URL}/api/signin`, {
      email: userEmail,
      password,
    });

    userToken = userSigninResponse.data.token;
    console.log("AdminToken", adminToken);
    console.log("UserToken", userToken);
  });

  test("User is not able to hit admin Endpoints", async () => {
    const elementReponse = await axios.post(
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
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "test space",
        defaultElements: [],
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Test Name",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    const updateElementResponse = await axios.put(
      `${BACKEND_URL}/api/admin/element/123`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );
    console.log(updateElementResponse.status);

    expect(elementReponse.status).toBe(403);
    expect(mapResponse.status).toBe(403);
    expect(avatarResponse.status).toBe(403);
    expect(updateElementResponse.status).toBe(403);
  });

  test("Admin is able to hit admin Endpoints", async () => {
    const elementReponse = await axios.post(
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

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        name: "Space",
        dimensions: "100x200",
        defaultElements: [],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/admin/avatar`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    expect(elementReponse.status).toBe(200);
    expect(mapResponse.status).toBe(200);
    expect(avatarResponse.status).toBe(200);
  });

  test("Admin is able to update the imageUrl for an element", async () => {
    const elementResponse = await axios.post(
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
    const updateElementResponse = await axios.put(
      `${BACKEND_URL}/api/admin/element/${elementResponse.data.id}`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    console.log(updateElementResponse.data);

    expect(updateElementResponse.status).toBe(200);
  });
});

describe("Websocket tests", () => {
  let adminToken;
  let adminUserId;
  let userToken;
  let adminId;
  let userId;
  let mapId;
  let element1Id;
  let element2Id;
  let spaceId;
  let ws1;
  let ws2;
  let ws1Messages = [];
  let ws2Messages = [];
  let userX;
  let userY;
  let adminX;
  let adminY;

  function waitForAndPopLatestMessage(messageArray) {
    return new Promise((resolve) => {
      if (messageArray.length > 0) {
        resolve(messageArray.shift());
      } else {
        let interval = setInterval(() => {
          if (messageArray.length > 0) {
            resolve(messageArray.shift());
            clearInterval(interval);
          }
        }, 100);
      }
    });
  }

  async function setupHTTP() {
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

    const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/signin`, {
      email: adminEmail,
      password,
    });

    adminUserId = adminSignupResponse.data.userId;
    adminToken = adminSigninResponse.data.token;
    console.log("adminSignupResponse.status");
    console.log(adminSignupResponse.status);

    const userSignupResponse = await axios.post(`${BACKEND_URL}/api/signup`, {
      username: userUsername,
      email: userEmail,
      password,
      role: "user",
    });
    const userSigninResponse = await axios.post(`${BACKEND_URL}/api/signin`, {
      email: userEmail,
      password,
    });
    userId = userSignupResponse.data.userId;
    userToken = userSigninResponse.data.token;
    console.log("useroktne", userToken);
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
        name: "Defaul space",
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

    const spaceResponse = await axios.post(
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

    console.log(spaceResponse.status);
    spaceId = spaceResponse.data.spaceId;
  }
  async function setupWs() {
    ws1 = new WebSocket(WS_URL);

    ws1.onmessage = (event) => {
      console.log("got back adata 1");
      console.log(event.data);

      ws1Messages.push(JSON.parse(event.data));
    };
    await new Promise((r) => {
      ws1.onopen = r;
    });

    ws2 = new WebSocket(WS_URL);

    ws2.onmessage = (event) => {
      console.log("got back data 2");
      console.log(event.data);
      ws2Messages.push(JSON.parse(event.data));
    };
    await new Promise((r) => {
      ws2.onopen = r;
    });
  }

  beforeAll(async () => {
    await setupHTTP();
    await setupWs();
  });

  test("Get back ack for joining the space", async () => {
    console.log("insixce first test");
    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: adminToken,
        },
      })
    );
    console.log("insixce first test1");
    const message1 = await waitForAndPopLatestMessage(ws1Messages);
    console.log("insixce first test2");
    ws2.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );
    console.log("insixce first test3");

    const message2 = await waitForAndPopLatestMessage(ws2Messages);
    const message3 = await waitForAndPopLatestMessage(ws1Messages);

    expect(message1.type).toBe("space-joined");
    expect(message2.type).toBe("space-joined");
    expect(message1.payload.users.length).toBe(0);
    expect(message2.payload.users.length).toBe(1);
    expect(message3.type).toBe("user-joined");
    expect(message3.payload.x).toBe(message2.payload.spawn.x);
    expect(message3.payload.y).toBe(message2.payload.spawn.y);
    expect(message3.payload.userId).toBe(userId);

    adminX = message1.payload.spawn.x;
    adminY = message1.payload.spawn.y;

    userX = message2.payload.spawn.x;
    userY = message2.payload.spawn.y;
  },10000);

  test("User should not be able to move across the boundary of the wall", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: 1000000,
          y: 10000,
        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test("User should not be able to move two blocks at the same time", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: adminX + 2,
          y: adminY,
        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  

  test("If a user leaves, the other user receives a leave event", async () => {
    ws1.close();
    const message = await waitForAndPopLatestMessage(ws2Messages);
    expect(message.type).toBe("user-left");
    expect(message.payload.userId).toBe(adminUserId);
  });
});
