/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus | null;
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      /** 管理员ID */
      id: string;
      /** 是否超级管理员 1是 2否 */
      is_superadmin?: number;
      /** 管理员昵称 */
      nick_name?: string;
      /** 管理员用户名 */
      user_name: string;
      roles: string[];
      buttons?: string[];
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }

  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      roleName: string;
      /** role code */
      roleCode: string;
      /** role description */
      roleDesc: string;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'status'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'id' | 'roleName' | 'roleCode'>;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonRecord<{
      /** user name */
      userName: string;
      /** user gender */
      userGender: UserGender | null;
      /** user nick name */
      nickName: string;
      /** user phone */
      userPhone: string;
      /** user email */
      userEmail: string;
      /** user role code collection */
      userRoles: string[];
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'userName' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'status'> &
        CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = '1' | '2';

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    type Menu = Common.CommonRecord<{
      /** parent menu id */
      parentId: number;
      /** menu type */
      menuType: MenuType;
      /** menu name */
      menuName: string;
      /** route name */
      routeName: string;
      /** route path */
      routePath: string;
      /** component */
      component?: string;
      /**
       * i18n key
       *
       * it is for internationalization
       */
      i18nKey?: string;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** menu order */
      order: number;
      /** whether to cache the route */
      keepAlive?: boolean;
      /** outer link */
      href?: string;
      /** whether to hide the route in the menu */
      hideInMenu?: boolean;
      /**
       * The menu key will be activated when entering the route
       *
       * The route is not in the menu
       *
       * @example
       *   the route is "user_detail", if it is set to "user_list", the menu "user_list" will be activated
       */
      activeMenu?: import('@elegant-router/types').LastLevelRouteKey;
      /** By default, the same route path will use one tab, if set to true, it will use multiple tabs */
      multiTab?: boolean;
      /** If set, the route will be fixed in tabs, and the value is the order of fixed tabs */
      fixedIndexInTab?: number;
      /** menu buttons */
      buttons?: MenuButton[];
      /** children menu */
      children?: Menu[];
    }>;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      id: number;
      label: string;
      pId: number;
      children?: MenuTree[];
    };
  }

  namespace Dict {
    interface Datum {
      /** 子字典 */
      enable_child_dict: EnableChildDict[];
      /** 字典ID */
      id: number;
      /** 字典值 */
      item_value: string;
    }
    interface EnableChildDict {
      /** 显示值 */
      display_value: string;
      /** 字典ID */
      id: number;
      /** 字典值 */
      item_value: string;
      /** 父级ID */
      parent_id: number;
    }
  }

  /** 分页信息 */
  interface Page {
    /** 当前页 */
    current_page: number;
    /** 总页数 */
    page_count?: number;
    /** 每页条数 最大100 */
    page_size: number;
    /** 总条数 */
    total?: number;
  }

  /** 自定义排序 */
  interface Sort {
    /** 排序字段名 允许字段: visit_num */
    field: string;
    /** 排序方式 正序:asc 倒序:desc */
    type: string;
    [property: string]: any;
  }

  namespace Request {
    interface Response<T> {
      /** 状态码 0为正常 非0为异常 状态码为2000为登录异常,请重新调用登录流程 */
      code: number;
      /** 响应内容 */
      data: T;
      /** code非0时为异常信息,code为0时固定为操作成功 */
      msg: string;
      [property: string]: any;
    }

    /** 响应内容(列表) */
    interface ListData<T> {
      list: T[];
      /** 分页信息 */
      page: Page;
      [property: string]: any;
    }
  }
  namespace User {
    interface UserInfo {
      /** 客户端类型-文本 */
      client_type_text: string;
      /** 国家名称 */
      country_name: string;
      /** 设备信息 */
      device_info: DeviceInfo;
      /** 首次付费时间(秒时间戳) */
      first_payment_time: number;
      id: number;
      /** 用户ID */
      user_id: number;
      /** 语言-文本 */
      language_text: string;
      /** 最后使用时间(秒时间戳) */
      last_used_time: number;
      /** 注册时间(秒时间戳) */
      register_time: number;
      /** 用户状态 1正常 2禁用 3注销 */
      status: number;
      /** 用户类型-文本 */
      user_type_text: string;
      /** 订阅信息 */
      subscribe_info?: SubscribeInfo;
      /** 用户偏好标签 */
      user_preference_tag?: UserPreferenceTag[];
      /** 用户风控类型-文本 */
      risk_type_text: string;
      risk_type: number;
      /** 是否订阅-文本 */
      is_subscribe_text: string;
      device_udid?: string;
      // 身份类型
      identity_type_text?: string;
      /** 未收集时，无此字段数据 */
      backup_info?: BackupInfo;
    }
    /** 未收集时，无此字段数据 */
    interface BackupInfo {
      /** 照片备份是否启用 */
      backup_photo_enabled: boolean;
      /** 视频备份是否启用 */
      backup_video_enabled: boolean;
      [property: string]: any;
    }

    /** 设备信息 */
    interface DeviceInfo {
      /** 应用名 */
      app_name: string;
      /** 应用版本 */
      app_version: string;
      /** 激活时间(秒时间戳) */
      create_time: number;
      /** 设备型号 */
      device_model: string;
      /** 设备名称 */
      device_name: string;
      /** 设备系统 */
      device_sys: string;
      /** 设备号 */
      device_udid: string;
      /** 设备ID */
      id: number;
      /** 网络 */
      network_list: string[];
      /** 分辨率-高度 */
      resolution_height: number;
      /** 分辨率-宽度 */
      resolution_width: number;
      permissions: Permissions;
    }

    /** 未收集时，无此字段数据 */
    interface Permissions {
      /** 电池优化是否启用 */
      battery_enabled: boolean;
      /** 通知权限是否启用 */
      notification_enabled: boolean;
      /** 存储权限是否启用 */
      storage_enabled: boolean;
      [property: string]: any;
    }

    /** 订阅信息 */
    interface SubscribeInfo {
      /** 生效时间(秒时间戳) */
      effect_time: number;
      /** 到期时间(秒时间戳) */
      expiry_time: number;
      /** 商品名 */
      product_name: string;
      /** 商品价格 */
      product_price: number;
    }

    interface UserPreferenceTag {
      /** 标签ID */
      id: number;
      /** 标签名 */
      tag_name: string;
      /** 标签得分 */
      tag_score: number;
    }
    interface UserLog {
      /** 日志内容 */
      content: string;
      /** 上报时间 */
      create_time: number | string;
      /** 事件名称 */
      event_name: string;
      /** 用户ID */
      user_id: number;
      app_name: string;
      app_version: string;
    }
  }
  namespace Document {
    interface List {
      id?: string;
      name?: string;
      content?: string;
      type?: string;
      size?: number;
      sizeStr?: string;
      path?: string;
      version?: string;
      isDeleted?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
      progress?: number;
      status?: string;
    }
  }
}
