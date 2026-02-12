import { View, Text } from 'react-native'
import React from 'react'
import { Comment } from '@/lib/types'

const CommentPost = ({ comment }: { comment: Comment }) => {
  return (
    <View className='  w-full p-2.5 py-1 my-1 bg-gray-300 flex rounded-lg'>
      <Text className=' text-black-100 font-bold'>{comment.idUser} username</Text>
      <Text className=' text-black-100'>{comment.libeleCom}</Text>
    </View>
  )
}

export default CommentPost;
