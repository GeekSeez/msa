import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { CreateUserDto } from "../common/dto/create-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { username, password } = createUserDto;
    const existing = await this.userModel.findOne({ username });
    if (existing) {
      throw new ConflictException("이미 존재하는 사용자입니다.");
    }
    const hash = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({ username, password: hash });
    return createdUser.save();
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    return user;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
}
