import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentsCreateDto } from '../dtos/comments.create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comments } from '../comments.schema';
import { Model } from 'mongoose';
import { CatsRepository } from 'src/cats/cats.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
    private readonly catsRepository: CatsRepository,
  ) {}

  async getAllComments() {
    try {
      const comments = await this.commentsModel.find();
      return comments;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createComment(id: string, commentData: CommentsCreateDto) {
    try {
      const targetCat =
        await this.catsRepository.findCatByIdWithoutPassword(id);

      const { author, contents } = commentData;

      const validatedAuthor =
        await this.catsRepository.findCatByIdWithoutPassword(author);

      const newComment = new this.commentsModel({
        authod: validatedAuthor._id,
        contents,
        cat: targetCat._id,
      });

      return await newComment.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async plusLike(id: string) {
    try {
      const comment = await this.commentsModel.findById(id);
      comment.likeCount += 1;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
