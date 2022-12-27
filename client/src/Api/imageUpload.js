
export const getImageUrl = async (image) => {

    const formData = new FormData()
    formData.append("image", image)

    const url = `https://api.imgbb.com/1/upload?key=0f5a083db22e4226b319f9514fefe1f4`;

   const res = await fetch(url, {
    method: "POST",
    body: formData,
   })
   const data = await res.json();
   return data.data.display_url;

}