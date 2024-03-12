import { HiOutlinePlusCircle } from "react-icons/hi";
import { Typography, IconButton } from "@mui/material";

const GetImage = ({ fileId, selectedFile, setSelectedFile }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setSelectedFile(file);
    } else {
      console.error("Invalid file type. Please select a JPG or PNG image.");
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(undefined);
  };
  return (
    <>
      <div className="mb-6">
        <div className="bg-gray-200 p-6">
          <div className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg bg-white">
            {!selectedFile ? (
              <label htmlFor={`file-upload-${fileId}`}>
                <IconButton component="span" aria-label="upload picture">
                  <HiOutlinePlusCircle className="image-bg" size={20} />
                </IconButton>
              </label>
            ) : (
              <img
                className="w-full h-96 object-cover cursor-pointer"
                onClick={() => handleRemoveImage()}
                src={typeof selectedFile === 'object' ? URL.createObjectURL(selectedFile) : selectedFile}
                alt="image preview"
              />
            )}
            <input
              id={`file-upload-${fileId}`}
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              hidden
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GetImage;
