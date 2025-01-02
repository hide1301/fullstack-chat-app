import { useState } from 'react'

const FullscreenImage = ({ src, alt }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleClick = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <>
      {/* Ảnh gốc */}
      <img
        src={src}
        alt={alt}
        onClick={handleClick}
        className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
      />

      {/* Ảnh phóng to */}
      {isFullscreen && (
        <div
          className="fixed inset-0 p-4 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={handleClick}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export default FullscreenImage
