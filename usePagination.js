import { useCallback, useState } from "react"

function totalLengthReducer(totalLength, array) {
  return totalLength + array.length
}

function usePagination(
  fetchPage,
  options
) {
  const [items, setItems] = useState(options.items || [])
  const [bufferedPages, setBufferedPages] = useState(
    options.bufferedPages || []
  )
  const [bufferedItems, setBufferedItems] = useState(() =>
    bufferedPages.reduce(totalLengthReducer, 0)
  )
  const [nextPageState, setNextPageState] =
    useState < Maybe < State >> (options.nextPageState || false)
  const [moreItemsToLoad, setMoreItemsToLoad] = useState(0)

  const itemsToBuffer = Math.max(0, options.itemsToBuffer || 0)
  const moreItemsToBuffer = Math.max(0, itemsToBuffer - bufferedItems)
  const canLoadMorePages = bufferedPages.length > 0 || nextPageState !== false

  useHttp(
    fetchPage,
    moreItemsToLoad || moreItemsToBuffer ? nextPageState : false,
    (nextPage) => {
      const itemsLoaded = nextPage.items.length

      if (itemsLoaded > 0) {
        if (moreItemsToLoad) {
          setItems([...items, ...nextPage.items])
          setMoreItemsToLoad(Math.max(0, moreItemsToLoad - itemsLoaded))
        } else {
          setBufferedPages([...bufferedPages, nextPage.items])
          setBufferedItems(bufferedItems + itemsLoaded)
        }
      }

      setNextPageState(nextPage.nextPageState)
    },
    (reason) => {
      setNextPageState(false)
    }
  )

  const loadMoreItems = useCallback(
    (itemsToLoad = 1) => {
      if (canLoadMorePages && moreItemsToLoad === 0 && itemsToLoad > 0) {
        if (bufferedItems === 0) {
          setMoreItemsToLoad(itemsToLoad)
        } else {
          const itemsLoaded = []
          const extraPages = []

          bufferedPages.forEach((bufferedPage) => {
            if (itemsLoaded.length < itemsToLoad) {
              itemsLoaded.push(...bufferedPage)
            } else {
              extraPages.push(bufferedPage)
            }
          })

          setItems([...items, ...itemsLoaded])
          setBufferedPages(extraPages)
          setBufferedItems(bufferedItems - itemsLoaded.length)
          setMoreItemsToLoad(Math.max(0, itemsToLoad - itemsLoaded.length))
        }
      }
    },
    [
      canLoadMorePages,
      moreItemsToLoad,
      bufferedItems,
      setMoreItemsToLoad,
      bufferedPages,
      setItems,
      items,
      setBufferedPages,
      setBufferedItems,
    ]
  )

  const resetState = useCallback(
    (resetOptions) => {
      setItems(resetOptions.items || [])
      setBufferedPages(resetOptions.bufferedPages || [])
      setBufferedItems(
        (resetOptions?.bufferedPages || []).reduce(totalLengthReducer, 0)
      )
      setNextPageState(resetOptions.nextPageState || false)
      setMoreItemsToLoad(0)
    },
    [
      setItems,
      setBufferedPages,
      setBufferedItems,
      setNextPageState,
      setMoreItemsToLoad,
    ]
  )

  return {
    items,
    canLoadMorePages,
    moreItemsToLoad,
    loadMoreItems,
    resetState,
  }
}

function useArrayPagination([items, ...bufferedPages]) {
  return usePagination((state) => state, { items, bufferedPages })
}

export { usePagination, useArrayPagination }

