const axios2= require("axios");

const axios = {
   post: async (...args)=>{
      try {
         const res = await axios2.post(...args);
         return res;
      } catch (error) {
         return error.response;
      }
   },
   get: async (...args)=>{
      try {
         const res = await axios2.get(...args);
         return res;
      } catch (error) {
         return error.response;
      }
   },
   put: async (...args)=>{
      try {
         const res = await axios2.put(...args);
         return res;
      } catch (error) {
         return error.response;
      }
   },
   delete: async (...args)=>{
      try {
         const res = await axios2.delete(...args);
         return res;
      } catch (error) {
         return error.response;
      }
   }
};

describe('Authentication', () => {
    //Signup
    test('Unique User Registration - Email', async () => { 
        const user1 = { username: "testadmin1", email: 'testadmin1@gmail.com', password: 'testpassword', role: "admin" };
        const response1 = await axios.post('http://localhost:8000/api/signup', user1);
        expect(response1.status).toBe(200);
        
        const user2 = { username: "testadmin2", email: 'testadmin1@gmail.com', password: 'testpassword2',role: "admin"};
        const response2 = await axios.post('http://localhost:8000/api/signup', user2);
        expect(response2.status).toBe(400);
     });
     test('Unique User Registration - Username', async () => { 
        const name = "testadmin"+Math.random();
        const user1 = { username: name, email: 'testadmin2@gmail.com', password: 'testpassword', role: "admin" };
        const response1 = await axios.post('http://localhost:8000/api/signup', user1);
        expect(response1.status).toBe(200);
        const user2 = { username: name, email: 'testadmin2@gmail.com', password: 'testpassword',role: "admin"};
        const response2 = await axios.post('http://localhost:8000/api/signup', user2);
        expect(response2.status).toBe(400);
     });
     test('Email not provided', async () => { 
        const user = { username: "testadmin"+Math.random(), password: 'testpassword2', role: "admin"};
        const response2 = await axios.post('http://localhost:8000/api/signup', user);
        expect(response2.status).toBe(400);
     });
     test('Username not provided', async () => { 
        const user = { email: "testadmin3@gmail.com", password: 'testpassword2', role: "admin"};
        const response2 = await axios.post('http://localhost:8000/api/signup', user);
        expect(response2.status).toBe(400);
     });
     test('Password not provided', async () => { 
        const user = { email: "testadmin3@gmail.com", password: 'testpassword2', role: "admin"};
        const response2 = await axios.post('http://localhost:8000/api/signup', user);
        expect(response2.status).toBe(400);
     });
     
     //Signin
     test('Valid Email', async () => {
        const user1 = { email: "testadmin1@gmail.com", password: 'testpassword', role: "admin"};
        const response1 = await axios.post('http://localhost:8000/api/signin', user1);
        expect(response1.status).toBe(200);

        const user2 = { email: "testadmin3223@gmail.com", password: 'testpassword', role: "admin"};
        const response2 = await axios.post('http://localhost:8000/api/signin', user2);
        expect(response2.status).toBe(400);

     });

     test('Valid Password', async () => {
        const user1 = { email: "testadmin1@gmail.com", password: 'testpassword', role: "admin"};
        const response1 = await axios.post('http://localhost:8000/api/signin', user1);
        expect(response1.status).toBe(200);

        const user2 = { email: "testadmin3223@gmail.com", password: 'testpasswordsnjsdj', role: "admin"};
        const response2 = await axios.post('http://localhost:8000/api/signin', user2);
        expect(response2.status).toBe(400);

     })

     test('Valid Password', async () => {
      const user1 = { email: "testadmin1@gmail.com", password: 'testpassword', role: "admin"};
      const response1 = await axios.post('http://localhost:8000/api/signin', user1);
      expect(response1.status).toBe(200);

      // const user2 = { email: "testadmin1@gmail.com", password: 'testpassword', role: "user"};
      // const response2 = await axios.post('http://localhost:8000/api/signin', user2);
      // expect(response2.status).toBe(200);

      const user3 = { email: "testadmin1@gmail.com", password: 'testpassword', role: "asdsd"};
      const response3 = await axios.post('http://localhost:8000/api/signin', user3);
      expect(response3.status).toBe(400);
      
      

   })
 })