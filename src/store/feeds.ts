// @ts-nocheck
import { createModel } from 'hox'
import React, { useState } from 'react'
import { IFeed } from '../shared'
import useLanguageModel from './language'
import useMessageModel from './message'
import useArticlesModel from './articles'
import Services from '../service'

type FeedsState = {
  isCreating: boolean
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  isUpdating: boolean
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
  feedList: IFeed[]
  setFeedList: React.Dispatch<React.SetStateAction<IFeed[]>>
  asyncFetchAllFeeds(showMessage?: boolean): void
  asyncDeleteFeeds(ids: string[]): void
  asyncCreateFeed(feedUrl: string): void
  getCurrentFeed(feedId?: string): IFeed | undefined
}
function useFeeds() {
  const { asyncFetchAllArticles } = useArticlesModel()
  const { setMessageParams } = useMessageModel()
  const { getLanguageData } = useLanguageModel()
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [feedList, setFeedList] = useState<IFeed[]>([])
  const asyncFetchAllFeeds = async (showMessage?: boolean) => {
    setIsUpdating(true)
    // @ts-ignore
    const feeds: any[] = await Services.getAllFeeds()
    // for (const feed of feeds) {
    //   await Services.updateFeedArticles(feed)
    // }
    console.info(feeds)
    setFeedList(feeds)
    await asyncFetchAllArticles()
    if (showMessage) {
      setMessageParams({
        message: getLanguageData('feedsAreUpdated'),
      })
    }
    setIsUpdating(false)
  }
  const asyncCreateFeed = (feedUrl: string) => {
    setIsCreating(true)
    Services.createFeed(feedUrl)
      .then(() => {
        console.info(feedUrl)
        setIsCreating(false)
        asyncFetchAllFeeds(true)
      })
      .catch(error => {
        console.error(error)
        setMessageParams({
          message: getLanguageData('un_found_feed'),
        })
        setIsCreating(false)
      })
  }
  const asyncDeleteFeeds = (ids: string[]) => {
    Services.deleteFeeds(ids)
  }
  const getCurrentFeed = (feedId: string) => {
    const feed = feedList.find((item: IFeed) => item.id === feedId)
    return feed
  }
  return {
    isCreating,
    setIsCreating,
    isUpdating,
    setIsUpdating,
    feedList,
    setFeedList,
    asyncFetchAllFeeds,
    asyncDeleteFeeds,
    asyncCreateFeed,
    getCurrentFeed,
  }
}

export default createModel<FeedsState>(useFeeds)
