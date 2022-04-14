import { gql } from 'apollo-server-express'
export default gql`
scalar DateTime
type StatutPrivate{
    user: User!
    list: [String!]!
}
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
    articles:[Article!]!
    privatedData: [String!]!
    favorites: [Article!]!
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
    favoriteCount: Int!
    favoritedBy: [User!]!
    likedBy: [User!]!
    likeCount:Int!
    comments:[Comment!]!
    createAt: DateTime!
    updateAt: DateTime!
}

type Comment{
    id:ID!
    commentedBy:User!
    content:String!
    article:Article!
    createAt: DateTime!
    updateAt: DateTime!
}

type Answer{
    id:ID!
    answeredBy:User!
    content:String!
    comment:Comment!
    createAt: DateTime!
    updateAt: DateTime!
}

type Query{
    users: [User!]!
    user(email:String!): User
    me: User!
    articles: [Article!]!
    article(id:ID!):Article!
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
