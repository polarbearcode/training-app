/** Define object properties for data pulled from database. */

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    accessToken?: string;
};

export type StravaActivity = {
    athlete: {id: string, resource_state: number};
    name: string;
    id: string;
    type: string;
    start_date: string;
    distance: number;
    total_elevation_gain: number;
    average_speed: number;
    max_speed: number;
    average_cadence: number;
    average_heartrate: number;
    [key:string]: unknown;
}

export type DatabaseActivity = {
    activityid: string;
    athleteid: string;
    activitytype: string;
    year: number;
    month: number;
    day: number;
    distance: number;
    totalelevationgain: number;
    averagespeed: number;
    maxspeed: number;
    averagecadence: number;
    averageheartrate: number;
    email: string;

}

/** 
resource_state: 2,
  athlete: [Object: null prototype] { id: 121786274, resource_state: 1 },
  name: 'Afternoon Run',
  distance: 3563.3,
  moving_time: 939,
  elapsed_time: 986,
  total_elevation_gain: 23.2,
  type: 'Run',
  sport_type: 'Run',
  workout_type: 0,
  id: 13158076072,
  start_date: '2024-12-20T23:50:56Z',
  start_date_local: '2024-12-20T15:50:56Z',
  timezone: '(GMT-08:00) America/Los_Angeles',
  utc_offset: -28800,
  location_city: null,
  location_state: null,
  location_country: 'United States',
  achievement_count: 3,
  kudos_count: 2,
  comment_count: 0,
  athlete_count: 1,
  photo_count: 0,
  map: [Object: null prototype] {
    id: 'a13158076072',
    summary_polyline: 'wrleFnzujV?DLXMd@E\\@|@Lr@\\~CGTi@T?BFf@DvAAf@Dz@CDCBoAJoCDgCL}APoBDyARiA?cBR{@@s@F_BTi@AmAL_CHgD^}AJaACe@BmBRaBFqBRgCL_A?QDONCr@EFWL_@JK?kAPsELsAHuANiAD{BT}@D}@JqEPkCRq@B]IAG?GLSA@@o@FgAv@qCd@aAZi@tAkB`@q@`B{A^WrBwAdB{@x@YXQ\\]Zg@@g@UoBMi@J_@Fm@@a@Gk@Oa@K}AKq@g@oAGY?ONEFGJY@UUkAWm@g@oBGGi@iBg@}BG}@Mm@IO',
    resource_state: 2
  },
  trainer: false,
  commute: false,
  manual: false,
  private: false,
  visibility: 'followers_only',
  flagged: false,
  gear_id: 'g17418579',
  start_latlng: [ 37.75, -122.51 ],
  end_latlng: [ 37.77, -122.5 ],
  average_speed: 3.795,
  max_speed: 5.58,
  average_cadence: 90.7,
  has_heartrate: true,
  average_heartrate: 167.5,
  max_heartrate: 185,
  heartrate_opt_out: false,
  display_hide_heartrate_option: true,
  elev_high: 28,
  elev_low: 6.7,
  upload_id: 14032041858,
  upload_id_str: '14032041858',
  external_id: 'garmin_ping_395305457966',
  from_accepted_tag: false,
  pr_count: 1,
  total_photo_count: 0,
  has_kudoed: false */
