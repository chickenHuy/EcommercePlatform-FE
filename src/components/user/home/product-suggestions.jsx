import { useEffect, useState } from "react"
import { getAccount } from "@/api/user/accountRequest"
import { getRecommendListProduct } from "@/api/ai/recommendRequest"
import ProductCard from "./product-card"
import { useInView } from "react-intersection-observer"
import { getProductBestInteraction } from "@/api/user/homeRequest"

export default function ProductSuggestions() {
  const pageSize = 6
  const limitAll = 240
  const limitUser = 240
  const limitOne = 240

  const [currentPage, setCurrentPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [listRecommendProduct, setListRecommendProduct] = useState([])
  const [listInteractionProduct, setListInteractionProduct] = useState([])
  const [loadPage, setLoadPage] = useState(false)

  const [userId, setUserId] = useState(null)

  const { ref: loadRef, inView } = useInView()

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await getAccount()
        setUserId(response.result.id)
      } catch (error) {
        console.error(error)
      }
    };
    fetchAccount()
  }, []);

  const fetchRecommendListProduct = async (isInitialLoad = false) => {
    try {
      setLoadPage(true)
      const response = await getRecommendListProduct(
        userId,
        isInitialLoad ? 1 : currentPage,
        pageSize,
        limitAll,
        limitUser,
        limitOne
      );
      setListRecommendProduct((prev) => (isInitialLoad ? response.data : [...prev, ...response.data]))
      setCurrentPage(response.nextPage)
      setHasNext(response.hasNext)
    } catch (error) {
      console.error("Error fetchRecommendListProduct:", error)
    } finally {
      setLoadPage(false)
    }
  }

  const fetchProductBestInteraction = async (isInitialLoad = false) => {
    try {
      setLoadPage(true)
      const response = await getProductBestInteraction(
        isInitialLoad ? 1 : currentPage,
        pageSize,
        limitAll,
      );
      setListInteractionProduct((prev) => (isInitialLoad ? response.result.data : [...prev, ...response.result.data]))
      setCurrentPage(response.result.nextPage)
      setHasNext(response.result.hasNext);
    } catch (error) {
      console.error("Error fetchProductBestInteraction:", error)
    } finally {
      setLoadPage(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchRecommendListProduct(true)
    }

    if (!userId || listRecommendProduct.length < 6) {
      fetchProductBestInteraction(true)
    }
  }, [userId])

  useEffect(() => {
    if (userId && inView && hasNext && listRecommendProduct.length >= 6) {
      fetchRecommendListProduct(false)
    } else if (inView && hasNext && listRecommendProduct.length < 6) {
      fetchProductBestInteraction(false)
    }
  }, [inView])

  if (listRecommendProduct.length >= 6) {
    return <ProductCard
      listProduct={listRecommendProduct}
      loadRef={loadRef}
      hasNext={hasNext}
      loadPage={loadPage}
      isPage="home"
    />
  } else {
    return <ProductCard
      listProduct={listInteractionProduct}
      loadRef={loadRef}
      hasNext={hasNext}
      loadPage={loadPage}
      isPage="home"
    />
  }
}
