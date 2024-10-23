'use client'

import { setSinglePostId } from "@/redux/slices/PostSlice"
import { useThemeData } from "@/redux/slices/ThemeSlice"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import ImageReact from "./ImageReact"
import LikeCommentDiv from "./LikeCommentDiv"
import { CardBody, CardContainer, CardItem } from "@/app/components/ui/3d_card";
import { PiSealCheckDuotone } from "react-icons/pi";
import { motion } from "framer-motion";
import { setInnerHTMLOfModal, setOpenMoadl, useModalState } from "@/redux/slices/ModalSlice"
import useOpenModalWithHTML from "@/utils/OpenModalWithHtml"
import { PostInterFace } from "@/Types"
import VideoPlayer from "./VideoPlayer"
import { MdZoomOutMap } from "react-icons/md";

// import { useSession } from "next-auth/react"

export default function SinglePostCard({ ele, className }: { ele: PostInterFace, className?: string }) {
  const themeMode = useThemeData().mode

  const dispatch = useDispatch()

  const router = useRouter()

  // const { data: session } = useSession()

  const promptText = ele.promptReturn

  const charactersWant = 90

  function cardClickHadler(postId: string) {

    // console.log(postId)

    dispatch(setSinglePostId(postId))

    router.push(`/post/${postId}`)
  }

  // console.log(ele)
  const callModalFn = useOpenModalWithHTML()

  const seeFullSizeHandler = (e: any, ele: PostInterFace) => {
    e?.stopPropagation();

    const innerHtml = <div className=' flex flex-col items-center justify-center '>
      <ImageReact
        src={ele?.author?.profilePic}
        className=' rounded '
      />
      <button
        className=' capitalize text-xs px-4 py-2 rounded-md bg-green-500 my-2'
        onClick={() => {
          router.push(`/user/${ele.author._id}`)
        }}
      >See, {ele?.author?.username || "Name Kumar"}'s profile</button>
    </div>

    callModalFn({ innerHtml })

    // dispatch(setInnerHTMLOfModal(innerHtml))
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ rotate: 360, scale: 1 }}
      transition={{
        type: 'tween',
        stiffness: 260,
        damping: 20
      }}

      onClick={(e) => { e.stopPropagation(); cardClickHadler(ele._id) }}
      className={` lg:my-7 p-[2px] bg-gradient-to-tr from-cyan-400  sm:w-80  sm:p-2 rounded-xl hover:cursor-pointer hover:scale-105 sm:hover:scale-110 active:scale-75 focus:scale-75 transition-all ${className}`}
    >

      <CardContainer className="inter-var">
        <CardBody className={` bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]  dark:border-white/[0.2] border-black/[0.1] h-auto rounded-xl  border shadow-xl w-[18rem] sm:w-[20rem] md:w-[25rem] lg:w-[30rem] ${!themeMode ? "dark:bg-black shadow-cyan-950" : "dark:bg-white shadow-cyan-50"} `}>

          <div
            className={` p-3 sm:p-6 rounded-xl border ${!themeMode ? " bg-black text-white border-slate-700 shadow-slate-700 " : " bg-white text-black border-slate-300 shadow-slate-300"}`}
            style={{
              backgroundColor: ele?.customize?.bgColor || '',
              color: ele?.customize?.color || '',
              backgroundImage: `${(ele?.image && (`url('${ele.author?.profilePic}')` === `${ele?.customize?.bgImage}`)) ? "" : `${ele?.customize?.bgImage}`}`,
              fontFamily: `${ele?.customize?.font} , sans-serif`,


              // // // added more style if user choosed profile pic as bg of post ------>
              backgroundRepeat: `url('${ele.author?.profilePic}')` === `${ele?.customize?.bgImage}` ? "no-repeat" : "",
              backgroundPosition: `url('${ele.author?.profilePic}')` === `${ele?.customize?.bgImage}` ? 'center' : "",
              backgroundSize: `url('${ele.author?.profilePic}')` === `${ele?.customize?.bgImage}` ? "cover" : "",
            }}
          >

            {/* User info div */}
            <CardItem
              translateZ="50"
              translateX={-10}
              className="text-xl font-bold "
            >
              <div
                className="rounded-t flex items-start p-0.5 gap-1.5  border-cyan-400"
                onClick={(e) => { seeFullSizeHandler(e, ele); e.stopPropagation(); }}

              >

                <ImageReact
                  className={`mt-2 rounded-full  w-8 h-8 aspect-square object-cover border p-[1px] border-[${ele?.customize?.color}] `}
                  src={`${ele?.author?.profilePic || "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"}`}
                  style={{ borderColor: ele?.customize?.color }}
                  alt=""
                />

                <div className=" mt-1">
                  <p className="  capitalize underline">{ele?.author?.username || "Name Kumar"}</p>
                  <p className=" text-[0.6rem] -mt-[1.5vh]">{ele?.author?.email || "xyz100@gmail.com"}</p>
                </div>

                {
                  ele?.author?.isVerified
                  &&
                  <span className="mr-2 mt-2.5 text-green-500 ">
                    <PiSealCheckDuotone />
                  </span>
                }
              </div>

            </CardItem>

            {/* Post info div here  */}
            <CardItem
              translateZ="120"
              rotateX={10}
              rotateZ={-1}
              className="w-full mt-4"
            >
              <>


                <div className=" flex flex-wrap items-center gap-1">
                  <p className="capitalize text-xl">{ele.title}</p>
                  {/* <p className=" ml-[75%] text-xs">({ele.category})</p> */}
                </div>

                <div className=" text-sm"

                // style={{ overflow : "hidden" , textOverflow : "ellipsis", whiteSpace : "balance"}}
                >

                  {
                    promptText.toString().length > charactersWant ? `${promptText.slice(0, charactersWant)}...` : `${promptText}`

                    // promptText
                  }

                </div>

                {/* Here we need to impove, when we will deal with video to. */}
                {/* This is modified now, Now we showing video also. */}
                {
                  ele?.image
                    ?
                    <div className=" relative">
                      <ImageReact
                        src={ele?.image}
                        className=" w-full h-[35vh] my-2 rounded object-top !object-cover"
                      />
                      <MdZoomOutMap className=" absolute bottom-2 right-2 text-xl " />
                    </div>

                    :

                    ele?.metaDataUrl
                    &&
                    <>

                      {
                        (ele?.metaDataType && ele?.metaDataType === 'video/mp4')
                          ?
                          <div className="h-[35vh]">

                            <VideoPlayer
                              postData={ele}
                              videoUrl={ele.metaDataUrl}
                              objectFit={'cover'}
                              height='35vh'
                            />
                          </div>
                          :
                          (ele.metaDataType === "image/jpeg" || ele.metaDataType === "image/png")
                          &&
                          <ImageReact
                            className=" w-full h-[35vh] my-2 rounded object-top !object-cover"
                            src={ele.metaDataUrl}
                          />
                      }

                    </>
                }


                <div className=" w-full flex justify-between items-center px-1">
                  <p className=" text-xs">({ele.category})</p>
                  <p className=" text-[0.6rem] mt-0 text-end">Uploaded on : {ele.whenCreated || "Date"}</p>
                </div>


                <div className=" flex flex-wrap gap-0.[2px] text-violet-500 font-semibold ">
                  {

                    (ele.hashthats.length > 0)
                    &&
                    ele.hashthats.map((hash, i) => {
                      return <p className="ml-1.5" key={i}>{hash}</p>
                    })
                  }
                </div>


              </>

            </CardItem>

            {/* Post like and all here */}
            <CardItem
              translateZ={20}
              translateX={20}
              as="div"
              className="px-4 py-2 ml-auto md:ml-2 rounded-xl text-xs font-normal "
            >

              <LikeCommentDiv post={ele} />

            </CardItem>


          </div>

        </CardBody>
      </CardContainer>

    </motion.div>
  )
};