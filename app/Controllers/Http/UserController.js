"use strict";

const User = use("App/Models/User");
const Hash = use("Hash");
// const Database = use("Database");

class UserController {
  async createUser({ request, response }) {
    const { user_name, email, password } = request.post();
    const user = new User();

    user.user_name = user_name;
    user.email = email;
    user.password = password;
    user.user_roles_id = 2;

    await user.save();

    response.status(201).send({
      message: "successfully registered this user"
    });
  }

  async login({ request, response, auth }) {
    try {
      const { email, user_name, password } = request.all();
      let token, user;
      let currentUser = User.query();
      if (user_name) {
        currentUser.where("user_name", user_name);
      } else if (email) {
        currentUser.where("email", email);
      }

      currentUser = await currentUser.first();

      if (!currentUser) {
        return response.status(400).send({
          message: "Email or passwoord incorrect"
        });
      }

      const isVerified = await Hash.verify(password, currentUser.password);

      if (!isVerified) {
        return response.status(400).send({
          message: "Email or passwoord incorrect"
        });
      }

      if (user_name) {
        token = await auth.withRefreshToken().attempt(user_name, password);
        user = await User.query()
          .select("id", "user_name", "email")
          .where("user_name", user_name)
          .fetch();
      } else if (email) {
        token = await auth
          .authenticator("jwtEmail")
          .withRefreshToken()
          .attempt(email, password);
        user = await User.query()
          .select("id", "user_name", "email")
          .where("email", email)
          .fetch();
      }

      return response.status(200).send({
        message: "user successfully logged In",
        data: user,
        token
      });
    } catch (error) {
      console.log(error);
      response.status(500).send({
        message: "internal server error",
        error
      });
    }
  }

  async getProfile({ response, auth }) {
    const authenticatedUser = await auth.current.user;

    if (!authenticatedUser) {
      return response.status(201).send({
        message: "User not authenticated"
      });
    }

    const user = await User.query()
      .where("id", authenticatedUser.id)
      .with("userRole")
      .fetch();

    return response.status(200).send({
      message: "view profile",
      data: user
    });
  }
}

module.exports = UserController;
