export interface AuthResponse {
    token:string
}

export interface LoginData {
    username:string,
    password:string
}

export interface User {
    id?:number,
    name:string,
    password:string,
    email:string,
    phone_number:string,
    bio?:string,
    profilePic?:string,
    createdAt?:string,
    modifiedAt?:string
}

export interface userChats{
    type:string,
    id:number,
    name:string,
    profile_pic?:string,
    max_modified_at:string
}

export interface message{
    id:number,
    content:string,
    sender_id:number,
    sender_name:string
    parent_message_id?:number,
    like_count?:number,
    created_at:string,
    modified_at:string
}

