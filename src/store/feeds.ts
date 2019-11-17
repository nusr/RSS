import { createModel } from 'hox'
import { useState } from 'react'
import { IFeed } from '../schemas'
import Logic from '../logic'
import useLanguageModel from './language'
import useMessageModel from './message'
function useFeeds() {
  const { setMessageParams } = useMessageModel()
  const { getLanguageData } = useLanguageModel()
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [feedList, setFeedList] = useState<IFeed[]>([])
  const [currentFeed, setCurrentFeed] = useState<IFeed>()
  const getAllFeeds = (showMessage?: string) => {
    setIsUpdating(true)
    Logic.getAllFeeds()
      .then((feeds: IFeed[]) => {
        setFeedList(feeds)
        setIsUpdating(false)
        if (showMessage) {
          setMessageParams({
            message: getLanguageData('feedsAreUpdated'),
          })
        }
      })
      .catch(() => {
        setIsUpdating(false)
        if (showMessage) {
          setMessageParams({
            message: getLanguageData('somethingWrong'),
          })
        }
      })
  }
  const asyncCreateFeed = (feedUrl: string) => {
    setIsCreating(true)
    Logic.createFeed(feedUrl)
      .then(() => {
        setIsCreating(false)
      })
      .catch(() => {
        setMessageParams({
          message: getLanguageData('unfoundFeed'),
        })
        setIsCreating(false)
      })
  }
  const asyncDeleteFeeds = (ids: string[]) => {
    Logic.deleteFeeds(ids)
  }
  return {
    isCreating,
    setIsCreating,
    isUpdating,
    setIsUpdating,
    feedList,
    setFeedList,
    getAllFeeds,
    asyncDeleteFeeds,
    setCurrentFeed,
    currentFeed,
    asyncCreateFeed,
  }
}

export default createModel<any>(useFeeds)
