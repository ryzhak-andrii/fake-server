const { appAuth, adminAuth, db } = require("./firebase/init");
const { signInWithEmailAndPassword, signOut } = require("firebase/auth");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async registerUser(req, res, next) {
    try {
      const userResponse = await adminAuth.createUser({
        email: req.body.email,
        password: req.body.password,
        emailVerified: false,
        disabled: false,
      });
      let user = {
        id: uuidv4(),
        fullName: req.body.fullName,
        email: req.body.email,
        role: req.body.role,
      };
      if (req.body.role === "user")
        user = {
          ...user,
          course: req.body.course,
          initialScore: req.body.initialScore,
          avatarUrl: req.body.avatarUrl,
        };
      await db.collection("users").doc(user.id).set(user);
      res.json(userResponse);
    } catch (error) {
      res.send(error);
    }
  },
  async login(req, res, next) {
    signInWithEmailAndPassword(appAuth, req.body.email, req.body.password)
      .then((userCredential) => {
        const user = userCredential.user;
        res.status(200).send(user);
      })
      .catch((error) => {
        const errorMsg = error.code;
        res.status(401).send(errorMsg);
      });
  },
  async logout(req, res, next) {
    signOut(appAuth)
      .then(() => {
        res.status(200).send();
      })
      .catch((error) => {
        res.send(error);
      });
  },
  async updateUser(req, res, next) {
    Object.keys(req.body).forEach((key) => {
      if (key === "email")
        adminAuth
          .getUserByEmail(req.params.id)
          .then((userRecord) => {
            adminAuth
              .updateUser(userRecord.uid, {
                email: req.body.email,
              })
              .then(() => {})
              .catch((error) => {
                res.send(error);
              });
          })
          .catch((error) => {
            res.send("Error fetching user data: ", error);
          });
      try {
        db.collection("users")
          .doc(req.params.id)
          .update({
            [key]: req.body[key],
          });
      } catch (error) {
        res.send(error);
      }
    });
    res.send("User update - success!");
  },
  async deleteUser(req, res, next) {
    adminAuth
      .getUserByEmail(req.params.id)
      .then((userRecord) => {
        adminAuth
          .deleteUser(userRecord.uid)
          .then(() => {})
          .catch((error) => {
            res.send(error);
          });
      })
      .catch((error) => {
        res.send("Error fetching user data: ", error);
      });
    try {
      await db.collection("users").doc(req.params.id).delete();
      res.send("User delete - success!");
    } catch (error) {
      res.send(error);
    }
  },
  async getAllUsers(req, res, next) {
    try {
      const usersRef = db.collection("users");
      const response = await usersRef.get();
      let responseArr = [];
      response.forEach((doc) => {
        responseArr.push(doc.data());
      });
      res.send(responseArr);
    } catch (error) {
      res.send(error);
    }
  },
  async getUser(req, res, next) {
    try {
      const userRef = db.collection("users").doc(req.params.id);
      const response = await userRef.get();
      res.send(response.data());
    } catch (error) {
      res.send(error);
    }
  },
};
