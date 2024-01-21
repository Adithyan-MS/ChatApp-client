export interface AuthResponse {
    token:string
}

export interface LoginData {
    username:string,
    password:string
}

export interface User {
    id:number,
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
    id:number,
    name:string,
    profile_pic?:string,
    type:string,
    latest_message?:string,
    latest_message_type?:string,
    latest_message_id:number|null,
    latest_message_sender_id?:number,
    latest_message_sender_name?:string,
    max_modified_at:string
}

export interface Room{
    id:number,
    name:string,
    description:string|null,
    room_pic:string|null,
    createdAt:string,
    modifiedAt:string
}

export interface Participant{
    id:number,
    name:string,
    bio:string|null,
    profile_pic:string|null,
    is_admin:boolean;
}

export interface message{
    id:number,
    content:string,
    type:string,
    sender_id:number,
    is_starred:boolean|null,
    sender_name:string
    parent_message_id?:number,
    parent_message_sender?:string,
    parent_message_sender_id?:number,
    parent_message_content?:string,
    parent_message_type?:string,
    like_count?:number,
    created_at:string,
    modified_at:string
}

export interface sendMessage{
    message:{
        content:string,
        type:string,
        parentMessage:number|null
    },
    receiver:{
        type:string,
        id:number
    }
}

export interface userSearch{
    name:string,
    id:number,
    profile_pic?:string
}

export interface chatSearch{
    id:number,
    name:string,
    type:string,
    profile_pic?:string
}

export interface receiver{
    id:number,
    type:string
}
