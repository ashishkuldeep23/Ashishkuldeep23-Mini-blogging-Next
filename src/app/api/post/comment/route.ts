import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import Comment from "@/models/commentModel";
import { NextRequest, NextResponse } from "next/server";





export async function POST(req: NextRequest) {

    await  connect()

    try {

        // console.log("fsdfsdfsdfsdfsfd")

        const reqBody = await req.json()

        // console.log(reqBody)

        const { postId, userId, comment } = reqBody

        if (!postId || !userId || !comment) {
            return NextResponse.json({ success: false, message: 'Mandatory fields not given.' }, { status: 400 })
        }


        // if(!author){
        //     return NextResponse.json({ success: false, message: 'Author id is not given.' }, { status: 404 })
        // }


        let findPost = await Post.findById(postId)

        if (!findPost) return NextResponse.json({ success: false, message: 'No post find with given post id.' }, { status: 404 })


        // console.log(findPost)


        let createComment = new Comment(reqBody)

        createComment = await createComment.save()

        findPost.comments.unshift(createComment._id)

        findPost = await findPost.save()

        // console.log(findPost)


        // // // Jsut getting for comment data avilable below. 
        await Comment.findById("660cba65c543855317a68f02")


        // return NextResponse.json({ success: true, data: createNewPost, message: "User created." }, { status: 201 })


        let getUpdatedPost = await Post.findById(postId)
            .populate({
                path: "author",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })
            .populate({
                path: "likesId",
                // match: { isDeleted: false },
                select: "-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
            })
            .populate({
                path: "comments",
                select: "-updatedAt -createdAt -__v  -postId ",
                populate: {
                    path: "userId",
                    // match: { isDeleted: false },
                    select: "-updatedAt -createdAt -__v  -userId -productID -isDeleted -verifyTokenExp -verifyToken -forgotPassExp -forgotPassToken -password",
                }
            })
            .select("-updatedAt -createdAt -__v ")




        return NextResponse.json(
            {
                success: true,
                data: getUpdatedPost,
                message: "New comment created."
            },
            {
                status: 201
            }
        )

    } catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }

}




