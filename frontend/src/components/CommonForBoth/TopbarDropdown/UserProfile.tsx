import { useRef, useState } from 'react';
import moment from 'moment';
import Icon from '@ailibs/feather-react-ts';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ConfigurationModal from 'src/components/Common/ConfigurationModal';
import ResendConfirmationEmail from 'src/components/Common/ResendConfirmationEmail';
import { uploadPublicFile } from 'src/helpers/api_helper';
import { pushUserInfo } from 'src/store/actions';
import { Input } from 'reactstrap';
import { UserInfoActionButton } from './UsersManager';


function ucfirst(text: string) {
  return text[0].toUpperCase() + text.slice(1).toLowerCase();
}


interface IImageUploader {
  src?: string;
  onChange(src: string): any;
}

const ImageUploader = (props: IImageUploader) => {
  const size = 64;
  const sizePixels = size + 'px';

  const ref = useRef(null);


  async function uploadImage(files: any) {
    const { url }: any = await uploadPublicFile({ name: 'Avatar', public: true }, files[0]);
    props.onChange(url);
  }


  function onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  function onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();

    const { files } = event.dataTransfer
    if (files != null && files.length > 0) {
      uploadImage([...files])
    }
  }

  function onClick(event: any) {
    const input: any = ref.current;
    input.click();
  }

  function onChange(event: any) {
    const input: any = ref.current;
    uploadImage([...input.files])
  }

  return (
    <div
      className="imageuploader"
      style={{ width: sizePixels, height: sizePixels }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      {props.src ? (
        <img src={props.src} width={size} className="imageuploader__image" />
      ) : null}

      <div className="imageuploader__uploadarea">
        <Icon name="upload" size={16} />
        <input
          ref={ref}
          type="file"
          onChange={onChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

interface IUserProfileEntries {
  children: any;
}

const UserProfileEntries = (props: IUserProfileEntries) => (
  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    {props.children}
  </div>
)

interface IUserProfileField {
  title: string;
  value?: string;
  children?: any;
}

const UserProfileField = (props: IUserProfileField) => (
  <div style={{ flex: '50%', marginBottom: '10px' }}>
    <span style={{ color: '#bbb', fontSize: '0.9em' }}>{props.title}</span>
    <div>{props.value ?? props.children}</div>
  </div>
);


interface IUserProfileEditableTextField {
  value: string;
  onChange(event: any): any;
  isEditMode: boolean;
}

const UserProfileEditableTextField = (props: IUserProfileEditableTextField) =>
  props.isEditMode
    ? (
      <div style={{ marginRight: '40px' }}>
        <Input value={props.value} onChange={e => props.onChange(e.target.value)} bsSize="sm" />
      </div>
    )
    : <span>{props.value}</span>
;


interface IUserProfile {
  onClose(): any;
  t: any;
}

const UserProfile = (props: IUserProfile) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.auth.user);

  const [avatarUrl, setAvatarUrl] = useState(userInfo.avatarUrl);
  const [name, setName] = useState(userInfo.name);
  
  const [isEditMode, setEditMode] = useState(false);
  const toggleEditMode = () => setEditMode(!isEditMode);

  if (!userInfo) {
    return null;
  }

  return (
    <ConfigurationModal
      title={props.t('User Profile')}
      onCancel={props.onClose}
      onSave={() => {
        if (avatarUrl !== userInfo.avatarUrl || name !== userInfo.name) {
          dispatch(pushUserInfo({ ...userInfo, avatarUrl, name }))
        }

        props.onClose();
      }}
      actions={[
        <UserInfoActionButton iconName={isEditMode ? 'eye' : 'edit'} onClick={toggleEditMode} key={1} />
      ]}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '20px' }}>
          <ImageUploader
            src={avatarUrl}
            onChange={url => setAvatarUrl(url)}
          />
        </div>
        <UserProfileEntries>
          <UserProfileField title={props.t('Username')} >
            <UserProfileEditableTextField value={name} isEditMode={isEditMode} onChange={value => setName(value)} />
          </UserProfileField>
          <UserProfileField title={props.t('E-mail address')} value={userInfo.email} />
          <UserProfileField title={props.t('Role')} value={userInfo.role.name} />
          <UserProfileField title={props.t('Registration method')} value={userInfo.externalServiceId ? ucfirst(userInfo.externalServiceId.service) : props.t('Registration form')} />
          <UserProfileField title={props.t('Registration date')} value={moment(userInfo.createdAt).format(props.t('dateFormat'))} />
          <UserProfileField title={props.t('Confirmed e-mail address')}>
            {userInfo.emailConfirmed
              ? props.t('Yes')
              : (<>
                <span>{props.t('No')}, <ResendConfirmationEmail>{props.t('resend')}</ResendConfirmationEmail></span>
              </>)}
          </UserProfileField>
        </UserProfileEntries>
      </div>
    </ConfigurationModal>
  )
}

export default withTranslation()(UserProfile);
