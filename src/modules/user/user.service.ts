 import AppError from "middleware/AppError.js"
import httpStatus from "http-status"
import { Role, type Prisma } from "@prisma/browser.js"
import prisma from "utils/prisma.js"
import bcrypt from 'bcrypt';
import config from "config/index.js";
import pickQuery from "utils/pickQuery.js"; 
import paginationHelper from "helpers/pagination.helpers.js";
import calculatePagination from "helpers/pagination.helpers.js";

const createUser = async(payload: Prisma.UserCreateInput)=>{
   try {
    const isExist = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
      include: {
        verification: {
          select: {
            status: true,
          },
        },
      },
    });

    payload['password'] =  await bcrypt.hash(payload.password, Number(config.salt_rounds));

    if (isExist) { 
      throw new AppError(
        httpStatus.CONFLICT,
        'User already exists and is verified',
      );
    }
    const result = await prisma.user.create({ data: payload });

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus?.BAD_GATEWAY, error?.message);
  }
}



const getUser = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);

  const { searchTerm, ...filtersData } = filters;

  // eslint-disable-next-line prefer-const
  let pipeline: Prisma.UserWhereInput = {
    AND: [],
    NOT: {
      role: Role.admin,
    },
  };
  // search condition
  if (searchTerm) {
    pipeline.OR = ['name', 'email', 'phoneNumber', 'status'].map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    }));
  }

  // Add filterQuery conditions
  if (Object.keys(filtersData).length > 0) {
    const oldAnd = pipeline.AND;
    const oldAndArray = Array.isArray(oldAnd) ? oldAnd : oldAnd ? [oldAnd] : [];

    pipeline.AND = [
      {
        isDeleted: false,
      },

      ...oldAndArray,
      ...Object.entries(filtersData).map(([key, value]) => ({
        [key]: { equals: value },
      })),
    ];
  }

  pipeline.NOT = {
    role: 'admin' as Role, 
  };

  // Sorting condition
  const { page, limit, skip, sort } =
     calculatePagination(pagination);

  let sortArray: any[] = [];
  if (sort) {
    sortArray = sort.split(',').map(field => {
      const trimmedField = field.trim();
      if (trimmedField.startsWith('-')) {
        return { [trimmedField.slice(1)]: 'desc' };
      }
      return { [trimmedField]: 'asc' };
    });
  }

  const data = await prisma.user.findMany({
    where: pipeline,
    skip,
    take: limit,
    orderBy: sortArray,
    select: {
      id: true, 
    },
  });

  const total = await prisma.user.count({
    where: pipeline,
  });

  return {
    data,
    meta: { page, limit, total },
  };
};

const userService ={
    getUser, 
    createUser
}

export default userService