import {GraphQLScalarType, kind} from "graphql"
class DateTime {
    constructor(){
        this.name = 'DateTime'
        this.description = `The DateTime scalar type represents string at
        UTC, such as 2020-02-06T10:15:30Z, compliant with the date-time 
        format outlined in section 5. of the RFC 3339 profile of the ISO 
        8601 standart for representation of dates and times using the 
        Gregorian calendar`
    }
    serialize(value){
        return value.toISOString().replace('T', " ").split('').slice(0,value.toISOString().lastIndexOf('.')).join('')
    }
    parseValue(value){
        return (new Date(value)).toISOString()
    }
    parseLiteral(ast){
        console.log("parseLiteral scalar type date")
        if(ast.kind === kind.Int)
            return new Date(parseInt(ast.value, 10));
        return null
    }
}

export default new GraphQLScalarType(new DateTime())