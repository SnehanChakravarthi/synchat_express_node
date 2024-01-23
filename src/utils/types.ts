export type WhatsAppWebhookPayload = {
  object: string;
  entry: Entry[];
};

type Entry = {
  id: string;
  changes: Changes[];
};

type Changes = {
  value: {
    contacts: Contact[];
    errors?: ErrorObject[];
    messaging_product: string;
    messages: MessageObject[];
    metadata: MetadataObject;
    statuses: StatusObject[];
  };
  field: string;
};

type Contact = {
  wa_id: string;
  profile: {
    name: string;
  };
};

type ErrorObject = {
  code: number;
  title: string;
  message?: string;
  error_data?: {
    details: string;
  };
};

interface BaseMessage {
  errors?: ErrorMessage[];
  from: string;
  id: string;
  identity?: IdentityObject;
  type: MessageType;
  context?: ContextObject;
  timestamp: string;
}

export type MessageObject = BaseMessage &
  (
    | AudioMessage
    | ButtonMessage
    | DocumentMessage
    | ImageMessage
    | InteractiveMessage
    | OrderMessage
    | ReferralMessage
    | StickerMessage
    | SystemMessage
    | TextMessage
    | VideoMessage
  );

type MessageType =
  | 'audio'
  | 'button'
  | 'document'
  | 'text'
  | 'image'
  | 'interactive'
  | 'order'
  | 'sticker'
  | 'system'
  | 'unknown'
  | 'video';

export interface AudioMessage {
  type: 'audio';
  audio: {
    id: string;
    mime_type: string;
  };
}

interface ButtonMessage {
  type: 'button';
  payload: string;
  text: string;
}

interface DocumentMessage {
  type: 'document';
  caption: string;
  filename: string;
  sha256: string;
  mime_type: string;
  id: string;
}
export interface ImageMessage {
  type: 'image';
  image: {
    caption: string;
    sha256: string;
    id: string;
    mime_type: string;
  };
}

interface InteractiveMessage {
  type: {
    button_reply?: {
      id: string;
      title: string;
    };
    list_reply?: {
      id: string;
      title: string;
      description: string;
    };
  };
}

interface OrderMessage {
  type: 'order';
  catalog_id: string;
  text: string;
  product_items: ProductItem[];
}

type ProductItem = {
  product_retailer_id: string;
  quantity: string;
  item_price: string;
  currency: string;
};

interface ReferralMessage {
  type: 'referral';
  source_url: string;
  source_type: string;
  source_id: string;
  headline: string;
  body: string;
  media_type: string;
  image_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  ctwa_clid: string;
}

interface StickerMessage {
  type: 'sticker';
  mime_type: string;
  sha256: string;
  id: string;
  animated: boolean;
}

interface SystemMessage {
  type: 'system' | 'customer_changed_number' | 'customer_identity_changed';
  body: string;
  identity: string;
  new_wa_id?: string;
  wa_id?: string;
  customer: string;
}

export interface TextMessage {
  type: 'text';
  text: {
    body: string;
  };
}

interface VideoMessage {
  type: 'video';
  caption: string;
  filename: string;
  sha256: string;
  id: string;
  mime_type: string;
}

type MetadataObject = {
  display_phone_number: string;
  phone_number_id: string;
};

type ConversationOrigin = {
  type:
    | 'authentication'
    | 'marketing'
    | 'utility'
    | 'service'
    | 'referral_conversion';
  expiration_timestamp?: string;
};

type Conversation = {
  id: string;
  origin: ConversationOrigin;
};

type Pricing = {
  billable: boolean;
  category:
    | 'authentication'
    | 'marketing'
    | 'utility'
    | 'service'
    | 'referral_conversion';
  pricing_model: string;
};

type StatusObject = {
  biz_opaque_callback_data: string;
  conversation: Conversation;
  errors: ErrorObject[];
  id: string;
  pricing: Pricing;
  recipient_id: string;
  status: 'delivered' | 'read' | 'sent';
  timestamp: number;
};

type ErrorMessage = {
  type: 'error';
  code: number;
  title: string;
  message?: string;
  error_data?: {
    details: string;
  };
};

type IdentityObject = {
  type: 'identity';
  acknowledged: boolean;
  created_timestamp: string;
  hash: string;
};

type ContextObject = {
  type: 'context';
  forwarded: boolean;
  frequently_forwarded: boolean;
  from: string;
  id: string;
  referred_product: {
    catalog_id: string;
    product_retailer_id: string;
  };
};
