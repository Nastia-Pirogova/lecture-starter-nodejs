import { userRepository } from "../repositories/userRepository.js";

class UserService {
  getAll() {
    return userRepository.getAll();
  }

  getById(id) {
    const user = userRepository.getOne({ id });
    if (!user) {
      return { error: { status: 404, message: "User not found" } };
    }
    return { data: user };
  }

  create(data) {
    const existingEmail = userRepository.getOne({ email: data.email });
    if (existingEmail) {
      return { error: { status: 400, message: "User with this email already exists" } };
    }

    const existingPhone = userRepository.getOne({ phone: data.phone });
    if (existingPhone) {
      return { error: { status: 400, message: "User with this phone already exists" } };
    }

    const user = userRepository.create(data);
    return { data: user };
  }

  update(id, dataToUpdate) {
    const existing = userRepository.getOne({ id });
    if (!existing) {
      return { error: { status: 404, message: "User not found" } };
    }

    if (dataToUpdate.email) {
      const emailUser = userRepository.getOne({ email: dataToUpdate.email });
      if (emailUser && emailUser.id !== id) {
        return { error: { status: 400, message: "User with this email already exists" } };
      }
    }

    if (dataToUpdate.phone) {
      const phoneUser = userRepository.getOne({ phone: dataToUpdate.phone });
      if (phoneUser && phoneUser.id !== id) {
        return { error: { status: 400, message: "User with this phone already exists" } };
      }
    }

    const updated = userRepository.update(id, dataToUpdate);
    return { data: updated };
  }

  delete(id) {
    const existing = userRepository.getOne({ id });
    if (!existing) {
      return { error: { status: 404, message: "User not found" } };
    }
    userRepository.delete(id);
    return { data: { message: "User deleted successfully" } };
  }

  search(search) {
    const item = userRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }
}

const userService = new UserService();

export { userService };
