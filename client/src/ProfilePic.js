export function ProfilePic({ first, last, imgUrl, toggleUploader }) {
    imgUrl = imgUrl || "../defaultUser.png";
    console.log("imgUrl", imgUrl);

    return (
        <div>
            <h1>profile pic comp</h1>
            <img
                onClick={toggleUploader}
                src={imgUrl}
                alt={`Profile picture for ${first} ${last}`}
            />
        </div>
    );
}
