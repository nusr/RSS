import { createModel } from 'hox'
import React, { useState } from 'react'
import { IFeed } from '../shared'
import useLanguageModel from './language'
import useMessageModel from './message'
import Logic from '../service'
type FeedsState = {
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  feedList: IFeed[];
  setFeedList: React.Dispatch<React.SetStateAction<IFeed[]>>;
  getAllFeeds(showMessage?: boolean): void;
  asyncDeleteFeeds(ids: string[]): void;
  asyncCreateFeed(feedUrl: string): void;
}
function useFeeds() {
  const { setMessageParams } = useMessageModel()
  const { getLanguageData } = useLanguageModel()
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [feedList, setFeedList] = useState<IFeed[]>([])
  const getAllFeeds = (showMessage?: boolean) => {
    setIsUpdating(true)
    Logic
      .getAllFeeds()
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
    Logic
      .createFeed(feedUrl)
      .then(() => {
        setIsCreating(false)
        getAllFeeds(true)
      })
      .catch(() => {
        setMessageParams({
          message: getLanguageData('unfound_feed'),
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
    asyncCreateFeed,
  }
}

export default createModel<FeedsState>(useFeeds)
