import React, {
  memo,
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import {View, Image, Pressable} from 'react-native';
import {Divider, Icon, List, ListItem} from '@ui-kitten/components';
import Text from './Text';
import IconHelper from './IconHelper';
import Modal from './Modal';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import util from '../../utils';
import {ThemeContext} from '../../contexts';

/**
 * User can press a Picture and show `ModalInsertPhoto`
 * If props `disabled` is not `true`
 */
const PressableImage = props => {
  const {size, children} = props;
  const [opacity, setOpacity] = useState(1);
  const {themeMode} = useContext(ThemeContext);

  const pressableStyle = useMemo(() => ({
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeMode === 'light' ? '#edf1f7' : '#1A2138',
    borderRadius: 4,
    opacity,
    overflow: 'hidden',
    ...props.style,
  }));

  return (
    <>
      {props.disabled ? (
        <View style={pressableStyle}>{children}</View>
      ) : (
        <Pressable
          onPressIn={() => setOpacity(0.8)}
          onPress={props.onPress}
          onPressOut={() => setOpacity(1)}
          style={pressableStyle}
        >
          {children}
        </Pressable>
      )}
    </>
  );
};

/**
 * Inserting photo via Modal resulting image base64 via
 *
 * `onSelectedImage={(base64) => some_code}` props
 */
const ModalInsertPhoto = memo(
  forwardRef((props, ref) => {
    const {onSelectedImage} = props;
    let Modal_ref;

    const handlePressMenu = async ImageCropPickerMethod => {
      try {
        const compressedImage = await ImageCropPickerMethod({
          mediaType: 'photo',
          compressImageMaxWidth: 1280,
          compressImageMaxHeight: 720,
        });

        const cropedImage = await ImageCropPicker.openCropper({
          path: compressedImage.path,
          cropperToolbarTitle: 'Potong Gambar',
          enableRotationGesture: false,
          showCropGuidelines: false,
          hideBottomControls: true,
          disableCropperColorSetters: true,
          width: 256,
          height: 256,
          includeBase64: true,
        });

        await ImageCropPicker.cleanSingle(
          RNFetchBlob.fs.dirs.SDCardApplicationDir + '/files',
        );
        await ImageCropPicker.clean();
        Modal_ref.hide();
        return `data:${cropedImage.mime};base64,${cropedImage.data}`;
      } catch (error) {
        throw error;
      }
    };

    useImperativeHandle(ref, () => ({
      show: () => Modal_ref.show(),
      hide: () => Modal_ref.hide(),
    }));

    return (
      <Modal ref={refs => (Modal_ref = refs)}>
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
          renderItem={items => {
            return (
              <ListItem
                title={items.item}
                accessoryLeft={accLeftProps => {
                  switch (items.index) {
                    case 0:
                      return (
                        <Icon
                          name='camera'
                          style={{...accLeftProps.style, tintColor: '#0095FF'}}
                        />
                      );
                      break;

                    case 1:
                      return (
                        <Icon
                          name='image-outline'
                          style={{...accLeftProps.style, tintColor: '#00E096'}}
                        />
                      );
                      break;

                    default:
                      return (
                        <Icon
                          name='trash-2-outline'
                          style={{...accLeftProps.style, tintColor: '#FF3D71'}}
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
  }),
  (prevProps, nextProps) => prevProps.hasImage === nextProps.hasImage,
);

/**
 * User can change or remove the Avatar with this Component
 *
 * @example
 * <Avatar
 *   uri={} // ImageURISource.uri
 *   size={number}
 *   onImageChange={(base64) => {}}
 *   disabled={boolean} // disable pressable
 *   parentStyle={{}} // <StyleProp>
 * />
 */
const Avatar = memo(
  forwardRef((props, ref) => {
    const {uri, onImageChange, disabled} = props;
    const sizeAvatar = props.size || 128;
    const [img, setImg] = useState(uri);
    const Modal_ref = useRef(null);

    useImperativeHandle(ref, () => ({
      setImgSrc: src => setImg(src),
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
          onPress={() => Modal_ref.current.show()}
          size={sizeAvatar}
          style={props.parentStyle}
          disabled={disabled}
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
              <IconHelper
                name='person-outline'
                size={Math.ceil(sizeAvatar * 0.33)}
                color='#8f9bb3'
              />
            </View>
          )}
        </PressableImage>

        {!disabled && (
          <ModalInsertPhoto
            hasImage={util.isValidImageBase64(img)}
            onSelectedImage={base64 => {
              setImg(base64);
              onImageChange?.(base64);
            }}
            onPressRemove={() => {
              Modal_ref.current.hide();
              setImg('');
              onImageChange?.('');
            }}
            ref={Modal_ref}
          />
        )}
      </>
    );
  }),
  (prevProps, nextProps) => prevProps.uri === nextProps.uri,
);

export default Avatar;
