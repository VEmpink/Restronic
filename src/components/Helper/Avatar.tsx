import React, {
  memo,
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useContext,
  useEffect,
  ReactNode,
  ForwardedRef,
} from 'react';
import {View, Image, Pressable, StyleProp, ViewStyle} from 'react-native';

import {Divider, Icon, List, ListItem} from '@ui-kitten/components';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';

import {ThemeContext} from '../../context';
import util from '../../utils';

import MemoizedIconHelper from './IconHelper';
import Modal, {ModalHelperMethods} from './Modal';
import Text from './Text';

type PressableImageProps = {
  /**
   * Avatar size
   */
  size: number;

  /**
   * Disable pressable?
   */
  disabled: boolean;
  children: ReactNode;
  style: StyleProp<ViewStyle>;
  onPress: () => void;
};

function PressableImage(props: PressableImageProps) {
  const {size, style, disabled, onPress, children} = props;
  const [opacity, setOpacity] = useState(1);
  const {themeMode} = useContext(ThemeContext);

  const pressableStyle: typeof style = [
    {
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeMode === 'light' ? '#edf1f7' : '#1A2138',
      borderRadius: 4,
      opacity,
      overflow: 'hidden',
    },
    style,
  ];

  return (
    <>
      {disabled ? (
        <View style={pressableStyle}>{children}</View>
      ) : (
        <Pressable
          onPressIn={() => setOpacity(0.8)}
          onPress={onPress}
          onPressOut={() => setOpacity(1)}
          style={pressableStyle}
        >
          {children}
        </Pressable>
      )}
    </>
  );
}

async function handlePressMenu(
  ImageCropPickerMethod:
    | typeof ImageCropPicker.openCamera
    | typeof ImageCropPicker.openPicker,
) {
  const compressedImage = await ImageCropPickerMethod({
    mediaType: 'photo',
    compressImageMaxWidth: 1280,
    compressImageMaxHeight: 720,
    writeTempFile: false,
  });

  const cropedImage = await ImageCropPicker.openCropper({
    mediaType: 'photo',
    path: compressedImage.path,
    cropperToolbarTitle: 'Potong Gambar',
    enableRotationGesture: false,
    showCropGuidelines: false,
    hideBottomControls: true,
    disableCropperColorSetters: true,
    width: 256,
    height: 256,
    includeBase64: true,
    writeTempFile: false,
  });

  await ImageCropPicker.cleanSingle(`${RNFetchBlob.fs.dirs.SDCardDir}/files`);

  await ImageCropPicker.clean();

  return `data:${cropedImage.mime};base64,${cropedImage.data}`;
}

type ModalInsertPhotoProps = {
  hasImage: boolean;
  onSelectedImage: (base64: string) => void;
  onPressRemove: () => void;
};

type ModalInsertPhotoMethods = {
  show: () => void;
  hide: () => void;
};

const FowardedModalInsertPhoto = forwardRef(function ModalInsertPhoto(
  props: ModalInsertPhotoProps,
  ref: ForwardedRef<ModalInsertPhotoMethods>,
) {
  const {onSelectedImage} = props;
  const modalRef = useRef<ModalHelperMethods>(null);

  useImperativeHandle(ref, () => ({
    show: () => modalRef.current?.show(),
    hide: () => modalRef.current?.hide(),
  }));

  return (
    <Modal ref={modalRef}>
      <List
        ListHeaderComponent={() => (
          <>
            <Text
              size={14}
              align='center'
              bold
              style={{paddingHorizontal: 8, paddingVertical: 12}}
            >
              Upload Foto
            </Text>
            <Divider />
          </>
        )}
        data={
          props.hasImage
            ? ['Buka Kamera', 'Buka Galeri', 'Hapus Foto']
            : ['Buka Kamera', 'Buka Galeri']
        }
        renderItem={(items) => {
          return (
            <ListItem
              title={items.item}
              accessoryLeft={(accLeftProps) => {
                switch (items.index) {
                  case 0:
                    return (
                      <Icon
                        name='camera'
                        style={[
                          {
                            tintColor: '#0095FF',
                          },
                          accLeftProps?.style,
                        ]}
                      />
                    );
                    break;

                  case 1:
                    return (
                      <Icon
                        name='image-outline'
                        style={[
                          {
                            tintColor: '#00E096',
                          },
                          accLeftProps?.style,
                        ]}
                      />
                    );
                    break;

                  default:
                    return (
                      <Icon
                        name='trash-2-outline'
                        style={[
                          {
                            tintColor: '#FF3D71',
                          },
                          accLeftProps?.style,
                        ]}
                      />
                    );
                    break;
                }
              }}
              onPress={async () => {
                try {
                  switch (items.index) {
                    case 0:
                      onSelectedImage(
                        await handlePressMenu(ImageCropPicker.openCamera),
                      );
                      break;

                    case 1:
                      onSelectedImage(
                        await handlePressMenu(ImageCropPicker.openPicker),
                      );
                      break;

                    default:
                      props.onPressRemove();
                      break;
                  }
                } catch (error) {
                  if (error.code !== 'E_PICKER_CANCELLED') {
                    util.snackbar.show(
                      'error',
                      `Gagal membuka Gambar atau Foto yang dipilih!`,
                      false,
                    );
                  }
                }
              }}
            />
          );
        }}
        style={{
          flexGrow: 0,
          minWidth: 192,
          borderRadius: 4,
        }}
        contentContainerStyle={{
          borderRadius: 4,
          overflow: 'hidden',
        }}
      />
    </Modal>
  );
});

/**
 * Inserting photo via Modal and resulting image base64
 */
const MemoizedModalInsertPhoto = memo(
  FowardedModalInsertPhoto,
  (prevProps, nextProps) => prevProps.hasImage === nextProps.hasImage,
);

type AvatarProps = {
  uri?: string;
  size?: number;

  /**
   * Disable pressable
   */
  disabled?: boolean;
  parentStyle?: StyleProp<ViewStyle>;
  onImageChange?: (base64: string) => void;
};

export type AvatarMethods = {
  setImgSrc: (src: string) => void;
  getImgSrc: () => string | undefined;
};

const FowardedAvatar = forwardRef(function Avatar(
  props: AvatarProps,
  ref: ForwardedRef<AvatarMethods>,
) {
  const {uri, size, onImageChange, disabled} = props;
  const sizeAvatar = size || 128;
  const [img, setImg] = useState(uri);
  const modalRef = useRef<ModalHelperMethods>(null);

  useImperativeHandle(ref, () => ({
    setImgSrc: (src) => setImg(src),
    getImgSrc: () => img,
  }));

  useEffect(() => {
    setImg(uri);
  }, [uri]);

  return (
    <>
      <PressableImage
        /**
         * This props will be disabled If "disabled" props is "true"
         */
        onPress={() => modalRef.current?.show()}
        size={sizeAvatar}
        style={props.parentStyle}
        disabled={disabled || false}
      >
        {util.isValidImageBase64(img) ? (
          <Image
            source={{
              uri: img,
              cache: 'force-cache',
              width: sizeAvatar,
              height: sizeAvatar,
            }}
          />
        ) : (
          <View pointerEvents='none'>
            <MemoizedIconHelper
              name='person-outline'
              size={Math.ceil(sizeAvatar * 0.33)}
              color='#8f9bb3'
            />
          </View>
        )}
      </PressableImage>

      {!disabled && (
        <MemoizedModalInsertPhoto
          hasImage={util.isValidImageBase64(img)}
          onSelectedImage={(base64) => {
            setImg(base64);
            onImageChange?.(base64);
          }}
          onPressRemove={() => {
            modalRef.current?.hide();
            setImg('-');
            onImageChange?.('-');
          }}
          ref={modalRef}
        />
      )}
    </>
  );
});

FowardedAvatar.defaultProps = {
  uri: undefined,
  size: 128,
  disabled: false,
  parentStyle: {},
  onImageChange: undefined,
};

/**
 * A component for displaying a profile picture
 */
const MemoizedAvatar = memo(
  FowardedAvatar,
  (prevProps, nextProps) => prevProps.uri === nextProps.uri,
);

export default MemoizedAvatar;
