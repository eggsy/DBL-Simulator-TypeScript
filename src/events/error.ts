import { Event } from "../structures";

export default class ErrorEvent extends Event {
  handler(error: Error) {
    console.error(error);
  }
}
