

export default function FileInput( {url, image, upload, deleteImage, num} )
{
    return (
        <p>
        {
            !url &&
            <p className = "bus_form_upload_icon_wrapper">
                <i className={image ? "fa-solid fa-pen-to-square" : "fa-solid fa-upload"} onClick = {upload}></i>
            </p>
        }
        {
            url &&
            <p className="image_and_delete_button">
                <i className={image ? "fa-solid fa-pen-to-square" : "fa-solid fa-upload"} onClick = {upload}></i>
                <i className={image ? "fa-solid fa-trash hidden" : "fa-solid fa-trash"} onClick={() => deleteImage(num)}></i>
                <img alt={"optional " + num} className={ image ? "form_images hidden" : "form_images"} src={url}></img>
            </p>
        }
        </p>
    )
}
