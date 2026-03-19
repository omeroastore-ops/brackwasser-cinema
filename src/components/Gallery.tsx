import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Gallery = () => {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from("gallery")
        .select("*");

      if (error) console.error(error);
      else setImages(data);
    }

    fetchImages();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-10">
      {images.map((img) => (
        <img
          key={img.id}
          src={img.image_url}
          className="w-full h-60 object-cover rounded-xl"
        />
      ))}
    </div>
  );
};

export default Gallery;