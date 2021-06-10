export function ProfilePic({
    first,
    last,
    imgUrl,
    toggleUploader,
    width,
    height,
}) {
    imgUrl = imgUrl || "../defaultUser.png";

    return (
        <img
            onClick={toggleUploader}
            src={imgUrl}
            height={width}
            width={height}
            alt={`Profile picture for ${first} ${last}`}
        />
    );
}
