export function getTimeDifferenceInSeconds(time1: string, time2: string): number {
    // Parse the locale time strings into Date objects
    const date1 = new Date(`1970-01-01 ${time1}`);
    const date2 = new Date(`1970-01-01 ${time2}`);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());

    // Convert milliseconds to seconds
    return Math.floor(diffInMilliseconds / 1000);
}

export function deepCopy(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj; // Return primitives or null directly
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle Array and Object using JSON methods for faster deep copy
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error("Deep copy failed for object:", obj, error);
    throw new Error("Unable to deep copy object!");
  }
}
export function setStimulsoftKey(Stimulsoft:any){
    Stimulsoft.Base.StiLicense.key =
    "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
    "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
    "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
    "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
    "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
    "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
    "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
}
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
export function getDecimalPlaces(num: number): number {
  const parts = num.toString().split('.');
  return parts[1]?.length || 0;
}
export function limitToFiveDecimals(value: number): number {
  if (value % 1 !== 0) {
    const decimals = value.toString().split('.')[1];
    if (decimals && decimals.length > 5) {
      return parseFloat(value.toFixed(5));
    }
  }
  return value;
  }
export function sumByKey<T>(items: T[], key: keyof T): number {
    return items.reduce((sum, item) => {
      const value = item[key];
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
}
export function PrintPreviewStiReport(Stimulsoft:any,report:any,reportData:any){
        const reprtresult = reportData;
        report.loadDocument(reprtresult);
        // Render report
        report.renderAsync();

        // Create an HTML settings instance. You can change export settings.
        var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
        // Create an HTML service instance.
        var service = new Stimulsoft.Report.Export.StiHtmlExportService();
        // Create a text writer objects.
        var textWriter = new Stimulsoft.System.IO.TextWriter();
        var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(textWriter);
        // Export HTML using text writer.
        service.exportTo(report, htmlTextWriter, settings);
        //  var contents =(<HTMLInputElement>document.getElementById("FrameDIv")).innerHTML;
        var frame1 = document.createElement("iframe");
        frame1.name = "frame1";
        frame1.style.position = "absolute";
        frame1.style.top = "-1000000px";
        document.body.appendChild(frame1);
        var frameDoc =
          (<HTMLIFrameElement>frame1).contentDocument || (<HTMLIFrameElement>frame1).contentWindow.document;
        frameDoc.open();
        frameDoc.write("</head><body>");
        frameDoc.write(textWriter.getStringBuilder().toString());
        frameDoc.write("</body></html>");
        frameDoc.close();
        setTimeout(function () {
          window.frames["frame1"].focus();
          window.frames["frame1"].print();
          document.body.removeChild(frame1);
        }, 500);
        return false;
}
export function getOnlyDateString(date: Date):string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}
export function getOnlyDateFromString(date: string):string {
  const newDate = date.replace(' PM', '').replace(' AM', '');
  return getOnlyDateString(new Date(newDate));
}