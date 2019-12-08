import { createModel } from 'hox'
import React, { useState } from 'react'
import { IFeed } from '../shared'
import useLanguageModel from './language'
import Toast from '../components/Toast'
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
  asyncBatchCreateFeed(feedUrls: string[]): void
  asyncCreateFeed(feedUrl: string): void
  getCurrentFeed(feedId?: string): IFeed | undefined
}
function useFeeds() {
  const { asyncFetchAllArticles } = useArticlesModel()
  const { getLanguageData } = useLanguageModel()
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [feedList, setFeedList] = useState<IFeed[]>([])
  const asyncFetchAllFeeds = async (showMessage?: boolean) => {
    setIsUpdating(true)
    let feeds: IFeed[] = await Services.getAllFeeds()
    feeds = feeds.filter(item => item.id)
    console.info(feeds)
    for (const feed of feeds) {
      await Services.updateFeedArticles(feed)
    }
    setFeedList(feeds)
    await asyncFetchAllArticles()
    if (showMessage) {
      Toast({
        content: getLanguageData('feedsAreUpdated'),
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
        Toast({
          content: JSON.stringify(error),
        })

        setIsCreating(false)
      })
  }
  const asyncBatchCreateFeed = (feedUrls: string[]) => {
    setIsCreating(true)
    Services.batchCreateFeed(feedUrls)
      .then(() => {
        setIsCreating(false)
        asyncFetchAllFeeds(true)
      })
      .catch(error => {
        console.error(error)
        Toast({
          content: JSON.stringify(error),
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
    asyncBatchCreateFeed,
  }
}

export default createModel<FeedsState>(useFeeds)
