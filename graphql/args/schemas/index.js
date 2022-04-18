import { gql } from 'apollo-server-express'
export default gql`
scalar DateTime

type User{
    id: ID!
    firstName: String!
    subName: String!
    date: String
    sexe: String
    tel: Int
    postalCode: Int
    email: String!
    avatar: String
    privatedData: [String!]!
    articles: [Article!]!
    favorites: [Article!]!
    reads: [Article!]!
    views: [Article!]!
    subscribes: [User!]!
    subscribedBy: [User!]!
    subscribeCount: Int!
    createAt: DateTime!
    updateAt: DateTime!
}
type Article{
    id: ID!
    title: String!
    textContent: String!
    videoLink: String
    author: User!
    numberPages: Int!
    nextArticle: Article
    prevArticle: Article
    favoriteCount: Int!
    favoritedBy: [User!]!
    likedBy: [User!]!
    likeCount:Int!
    unlikedBy: [User!]!
    unlikeCount:Int!
    readingBy: [User!]!
    readingCount: Int!
    viewedBy: [User!]!
    viewsCount: Int!
    comments:[Comment!]!
    createAt: DateTime!
    updateAt: DateTime!
}

type Comment{
    id:ID!
    commentedBy:User!
    content:String!
    linkedToArticle:Article!
    answers: [Answer!]!
    createAt: DateTime!
    updateAt: DateTime!
}

type Answer{
    id:ID!
    answeredBy:User!
    content:String!
    toComment:Comment!
    createAt: DateTime!
    updateAt: DateTime!
}

type Query{
    users: [User!]!
    user(email:String!): User
    me: User!
    articles: [Article!]!
    article(id:ID!):Article!
    comment(id:ID):Comment!
    answer(id:ID):Answer!
}

type Mutation{
    #article section
    newArticle(title:String!,textContent:String!,videoLink:String):Article!
    updateArticle(id:ID!,title:String,textContent:String,videoLink:String):Article!
    deleteArticle(id:ID!):Boolean!
    toggleFavorite(id:ID!):Article! 
    toggleLike(id:ID!):Boolean!
    #comment section
    newComment(id:ID!,content:String!):Comment!
    updateComment(id:ID!,content:String!):Comment! #id Comment
    deleteComment(id:ID!):Boolean!
    #user section
    signup(
        firstName:String!, 
        subName:String!,
        sexe: String!,
        email: String!,
        password: String!
    ):String!
    signin(email:String!, password:String!): String!
    signout:String!
    updateUser(
        id:ID!,
        firstName: String,
        subName: String,
        sexe: String,
        email: String
    ): User!
    deleteUser(id:ID): Boolean!
    makeDataUserPrivated(id:ID,privatedData:[String!]!):[String!]!
    toggleSubscribe(id:ID!):User!
}`;
