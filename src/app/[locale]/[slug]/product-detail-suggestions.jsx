import { getRecommendProduct } from "@/api/ai/recommendRequest"
import ProductCard from "@/components/user/home/product-card"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

export default function ProductDetailSuggestions({ productId }) {
  const pageSize = 24
  const limitAll = 240

  const [currentPage, setCurrentPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [listProduct, setListProduct] = useState([])
  const [loadPage, setLoadPage] = useState(false)

  const { ref: loadRef, inView } = useInView()

  const fetchRecommendProduct = async (isInitialLoad = false) => {
    try {
      setLoadPage(true)
      const response = await getRecommendProduct(
        productId,
        isInitialLoad ? 1 : currentPage,
        pageSize,
        limitAll,
      );

      setListProduct((prev) => (isInitialLoad ? response.data : [...prev, ...response.data]))
      setCurrentPage(response.nextPage)
      setHasNext(response.hasNext)
    } catch (error) {
      console.error("Error fetchRecommendProduct:", error)
    } finally {
      setLoadPage(false)
    }
  }

  useEffect(() => {
    fetchRecommendProduct(true)
  }, []);

  useEffect(() => {
    if (inView && hasNext && listProduct.length >= 6) {
      fetchRecommendProduct(false)
    }
  }, [inView])

  if (listProduct.length === 0) {
    return null;
  }

  return <ProductCard
    listProduct={listProduct}
    loadRef={loadRef}
    hasNext={hasNext}
    loadPage={loadPage}
  />
}
