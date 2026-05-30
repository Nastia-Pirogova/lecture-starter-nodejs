import { userService } from "./userService.js";

class AuthService {
  login({ email, password }) {
    const user = userService.search({ email, password });
    if (!user) {
      throw Error("User not found");
    }
    return user;
  }
}

const authService = new AuthService();

export { authService };
