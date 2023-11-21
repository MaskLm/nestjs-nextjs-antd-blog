import { UserOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  List,
  Comment,
  Avatar,
  Image,
  message,
} from 'antd';
import { useState, useEffect } from 'react';
import getAvatarURL from '../../tools/account/getAvatar';
import axiosInstance from '../../tools/AxiosInterceptorsJwt';
import { AccountData } from '../../tools/interfaces/account.data';
import axios from 'axios';
import checkAdmin from '../../tools/CheckAdmin';

const { TextArea } = Input;

interface CommentItem {
  id: number;
  actions: React.ReactNode[];
  from_user_Id: number;
  from_user_nickname: string;
  from_user_avatar: string;
  to_user_nickname: string;
  to_user_Id: number;
  datetime: string;
  content: string;
}

interface EditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
  to_user_nickname: string;
  set_to_user_id: React.Dispatch<
    React.SetStateAction<number | null | undefined>
  >;
  set_to_user_nickname: React.Dispatch<React.SetStateAction<string>>;
}

const CommentList = ({ comments }: { comments: CommentItem[] }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={(props) => (
      <Comment
        actions={props.actions}
        author={
          <>
            <a>{props.from_user_nickname}</a>{' '}
            <span>
              {props.to_user_nickname ? (
                <a>To {props.to_user_nickname}</a>
              ) : null}
            </span>
          </>
        }
        avatar={
          props.from_user_avatar ? (
            <Avatar
              icon={<Image src={props.from_user_avatar} preview={false} />}
            />
          ) : (
            <Avatar icon={<UserOutlined />} />
          )
        }
        content={<p>{props.content}</p>}
        datetime={<span>{props.datetime}</span>}
      />
    )}
  />
);

interface CommentsProps {
  topicId: number;
}

const Editor: React.FC<EditorProps> = ({
  onChange,
  onSubmit,
  submitting,
  value,
  to_user_nickname,
  set_to_user_id,
  set_to_user_nickname,
}) => (
  <>
    {to_user_nickname ? (
      <span
        onClick={() => {
          set_to_user_id(null);
          set_to_user_nickname('');
        }}
        className="replySpan"
      >
        Reply to {to_user_nickname} ( Click here to cancel )
      </span>
    ) : null}
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
);

const Comments: React.FC<CommentsProps> = ({ topicId }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [to_user_Id, set_to_user_id] = useState<number | null>();
  const [to_user_nickname, set_to_user_nickname] = useState<string>('');
  const [value, setValue] = useState('');
  const [avatarURL, setAvatarURL] = useState('');

  const handleSubmit = async () => {
    if (!account) message.warn('Please Login');
    else {
      if (!value) return;

      setSubmitting(true);
      try {
        await axiosInstance.post(
          process.env.NEXT_PUBLIC_API_URL + '/blog/comment',
          {
            from_user: account.sub,
            to_user: to_user_Id,
            content: value,
            topic: topicId,
          },
        );
        message.success('Comment submitted successfully');
      } catch (e) {
        console.error(e);
      }

      setTimeout(() => {
        setSubmitting(false);
        setValue('');
      });
    }
  };
  useEffect(() => {
    handleSetComments();
  }, [submitting]);

  const handleSetComments = async () => {
    try {
      const abortController = new AbortController();
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + '/blog/comment',
        {
          signal: abortController.signal,
          params: {
            topic: topicId,
          },
        },
      );
      const commentItems: CommentItem[] = response.data.map(
        (comment: Omit<CommentItem, 'actions'>) => {
          return {
            ...comment,
            actions: [
              <span
                key="comment-basic-reply-to"
                onClick={() => {
                  set_to_user_id(comment.from_user_Id);
                  set_to_user_nickname(comment.from_user_nickname);
                }}
              >
                Reply to
              </span>,
              checkAdmin() ? (
                <span
                  onClick={async () => {
                    try {
                      await axiosInstance.delete(
                        process.env.NEXT_PUBLIC_API_URL +
                          '/blog/comment/' +
                          comment.id,
                      );
                      message.success('Delete comment success');
                      handleSetComments();
                    } catch (e) {
                      message.error('Delete comment error');
                    }
                  }}
                >
                  Delete
                </span>
              ) : null,
            ],
          };
        },
      );
      setComments(commentItems);
    } catch (e) {
      console.error(e);
      message.error('Loading comments error');
    }
  };

  useEffect(() => {
    const storedAccount = localStorage.getItem('account');
    const accountTemp = storedAccount ? JSON.parse(storedAccount) : null;
    setAccount(accountTemp);
    setAccount(accountTemp);
    if (accountTemp) {
      getAvatarURL(accountTemp).then((url) => {
        setAvatarURL(url);
      });
    }
    handleSetComments();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        avatar={
          avatarURL ? (
            <Avatar icon={<Image src={avatarURL} preview={false} />} />
          ) : (
            <Avatar icon={<UserOutlined />} />
          )
        }
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
            to_user_nickname={to_user_nickname}
            set_to_user_id={set_to_user_id}
            set_to_user_nickname={set_to_user_nickname}
          />
        }
      />
    </>
  );
};

export default Comments;
