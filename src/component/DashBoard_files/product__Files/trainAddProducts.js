import { useState } from "react"
import { Axios } from "../../../assets/Auth/Axios"


const AddProducts = () => {

    const [images, setImages] = useState([])



    const handleAddingItems = async (e) => {
        const selectedItems = Array.from(e.target.files)
        if (!selectedItems) return
        const previewItems = selectedItems.map((item) => ({
            ...item,
            uId: `${Date.now()}-${item.name}-${item.size}`,
            preview: URL.createObjectURL(item),
            size: item.size,
            state: 'pending',
            progress: '0'

        }))
        // newData = selectedData which not exist in the currentData 
        // // // // then i need    selectedData          |           currentData
        // newData = selectedData.filter(data => !currentData.has(data))
        // return [...previousData , newData]

        setImages(
            prev => {
                const existImgs = prev.map(item => item.uId)
                const newItems = previewItems.filter(img => !existImgs.has(img))
                return [...prev, newItems]
            }
        )
        try {
            const formData = new FormData()
            formData.append(previewItems)
            const res = await Axios.post(``)
        } catch (err) {
            console.log(err.message)
        }



        // check duplication with the is id which i used as an item name and size

        const duplicate = images.some(item => selectedItems.has(item))



    }
}