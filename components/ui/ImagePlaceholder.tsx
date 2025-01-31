import { Image, ImageProps } from "react-native";

type ImagePlaceholderProps = {
    size?:number
} & ImageProps

export default function ImagePlaceholder({size=600}:ImagePlaceholderProps){
    return (
        <Image source={{uri:`https://picsum.photos/${size}`}} style={{height:"100%", width:"100%"}}/>
    )
}