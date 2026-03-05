# Design Document: BRI Intelligence Dashboard Enhancement

## Overview

### System Purpose

BRI Intelligence Dashboard Enhancement adalah sistem business intelligence komprehensif yang mengintegrasikan tiga pilar utama: Territorial Intelligence Dashboard untuk analisis geospasial, Conversational Intelligence Analytics untuk insight berbasis AI, dan Market & Opportunity Enrichment untuk integrasi data eksternal. Sistem ini dirancang untuk membantu Area Manager, Regional Manager, RM, dan analyst dalam membuat keputusan strategis berbasis data untuk akuisisi merchant dan ekspansi teritorial.

### Key Objectives

1. Menyediakan visualisasi geospasial interaktif dengan heatmap, cluster analysis, dan drill-down capability hingga level kelurahan
2. Mengimplementasikan conversational AI analytics yang dapat memproses natural language query dan auto-generate visualisasi
3. Mengintegrasikan data eksternal (merchant directory, demografi, POI, competitive intelligence) untuk market enrichment
4. Memastikan performa optimal dengan caching strategy dan lazy loading untuk dataset besar
5. Menyediakan RBAC untuk kontrol akses berdasarkan role dan wilayah assignment

### Technology Stack

- **Frontend**: React 18+ dengan TypeScript, Leaflet/Mapbox GL JS untuk mapping, Recharts untuk visualisasi
- **Backend**: Java Spring Boot 3.x dengan Spring Data JPA, Spring Security untuk RBAC
- **Database**: PostgreSQL 14+ dengan PostGIS extension untuk geospatial data
- **AI Engine**: Google Gemini AI API untuk natural language processing dan insight generation
- **Caching**: Redis untuk application-level caching
- **External APIs**: Google Places API (POI), BPS API (demografi), Merchant Directory API



## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Map Component│  │ AI Chat UI   │  │ Dashboard    │          │
│  │ (Leaflet)    │  │              │  │ Widgets      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
│                    REST API / WebSocket                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                      Backend Layer (Spring Boot)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ API Gateway  │  │ Auth Service │  │ Cache Layer  │          │
│  │ Controller   │  │ (Spring Sec) │  │ (Redis)      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                                                        │
│  ┌──────┴───────────────────────────────────────┐               │
│  │           Service Layer                      │               │
│  │  ┌─────────────┐  ┌─────────────┐           │               │
│  │  │ Territorial │  │ AI Analytics│           │               │
│  │  │ Service     │  │ Service     │           │               │
│  │  └─────────────┘  └─────────────┘           │               │
│  │  ┌─────────────┐  ┌─────────────┐           │               │
│  │  │ Integration │  │ Notification│           │               │
│  │  │ Service     │  │ Service     │           │               │
│  │  └─────────────┘  └─────────────┘           │               │
│  └──────────────────────────────────────────────┘               │
│         │                                                        │
│  ┌──────┴───────────────────────────────────────┐               │
│  │         Data Access Layer (JPA)              │               │
│  └──────────────────────────────────────────────┘               │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                    Data Layer                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PostgreSQL   │  │ PostGIS      │  │ Redis Cache  │          │
│  │ (Core Data)  │  │ (Geospatial) │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                  External Integration Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Gemini AI    │  │ Google Places│  │ BPS API      │          │
│  │ API          │  │ API          │  │ (Demografi)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │ Merchant Dir │  │ Competitor   │                            │
│  │ API          │  │ Data API     │                            │
│  └──────────────┘  └──────────────┘                            │
└──────────────────────────────────────────────────────────────────┘
```

### Architecture Patterns

1. **Layered Architecture**: Separation of concerns dengan clear boundaries antara presentation, business logic, dan data access
2. **Repository Pattern**: Abstraksi data access untuk memudahkan testing dan maintenance
3. **Service Layer Pattern**: Business logic terisolasi dalam service classes
4. **API Gateway Pattern**: Single entry point untuk semua client requests dengan routing dan authentication
5. **Cache-Aside Pattern**: Application-level caching dengan Redis untuk frequently accessed data
6. **Event-Driven Pattern**: WebSocket untuk real-time updates tanpa polling



## Components and Interfaces

### Frontend Components

#### 1. GeoMapComponent

**Responsibility**: Menampilkan peta interaktif dengan heatmap, cluster, markers, dan drawing tools.

**Key Features**:
- Heatmap visualization dengan multiple metric options
- Cluster analysis dengan dynamic marker sizing
- Administrative boundary layers (provinsi, kota, kecamatan, kelurahan)
- Drawing tools untuk custom area selection (circle, rectangle, polygon)
- POI markers dengan kategori filtering
- Drill-down navigation dengan breadcrumb

**Props Interface**:
```typescript
interface GeoMapProps {
  center: [number, number];
  zoom: number;
  heatmapMetric: 'penetration' | 'casa' | 'density' | 'productivity';
  merchants: Merchant[];
  clusters: ClusterData[];
  boundaries: AdministrativeBoundary[];
  pois: PointOfInterest[];
  onAreaSelect: (area: CustomArea) => void;
  onDrillDown: (level: string, id: string) => void;
  filters: MapFilters;
}
```

**State Management**:
- Map viewport state (center, zoom, bounds)
- Active layers (heatmap, clusters, POI, boundaries)
- Selected features (merchants, areas, clusters)
- Drawing mode state

#### 2. AIAnalyticsComponent

**Responsibility**: Interface conversational AI untuk natural language query dan auto-generated visualizations.

**Key Features**:
- Chat interface dengan message history
- Natural language input processing
- Auto-generated visualizations (charts, tables, maps)
- Multi-type insight display (descriptive, diagnostic, predictive, prescriptive)
- Next best action recommendations
- Query suggestions dan auto-complete

**Props Interface**:
```typescript
interface AIAnalyticsProps {
  sessionId: string;
  onQuerySubmit: (query: string) => Promise<AIResponse>;
  onVisualizationExpand: (viz: Visualization) => void;
  onActionCreate: (action: NextBestAction) => void;
}

interface AIResponse {
  message: string;
  insights: Insight[];
  visualization?: Visualization;
  nextBestActions?: NextBestAction[];
}
```

#### 3. DashboardWidgetComponent

**Responsibility**: Menampilkan key metrics, statistics, dan mini visualizations.

**Key Features**:
- Metric cards (penetration rate, TAM, CASA value)
- Trend charts (sparklines)
- Comparison tables
- Alert indicators
- Export functionality

**Props Interface**:
```typescript
interface DashboardWidgetProps {
  title: string;
  metric: MetricData;
  trend?: TrendData;
  comparison?: ComparisonData;
  alerts?: Alert[];
  onExport: (format: ExportFormat) => void;
}
```

#### 4. FilterPanelComponent

**Responsibility**: Multi-level filtering untuk wilayah administratif dan data attributes.

**Props Interface**:
```typescript
interface FilterPanelProps {
  administrativeLevels: {
    provinces: Province[];
    cities: City[];
    districts: District[];
    subDistricts: SubDistrict[];
  };
  selectedFilters: SelectedFilters;
  onFilterChange: (filters: SelectedFilters) => void;
  onClearAll: () => void;
}
```

### Backend Services

#### 1. TerritorialService

**Responsibility**: Business logic untuk territorial intelligence features.

**Key Methods**:
```java
public interface TerritorialService {
    HeatmapData generateHeatmap(HeatmapRequest request);
    List<ClusterData> performClusterAnalysis(ClusterRequest request);
    TerritorialStats getDrillDownData(String level, String id);
    CustomAreaAnalysis analyzeCustomArea(CustomArea area);
    List<AdministrativeBoundary> getBoundaries(String level, String parentId);
}
```

**Dependencies**:
- MerchantRepository
- AdministrativeBoundaryRepository
- GeospatialService
- CacheService

#### 2. AIAnalyticsService

**Responsibility**: Orchestration untuk AI-powered analytics dan insight generation.

**Key Methods**:
```java
public interface AIAnalyticsService {
    AIResponse processNaturalLanguageQuery(String query, String userId);
    Visualization generateVisualization(QueryIntent intent, QueryResult data);
    List<Insight> generateMultiTypeInsights(AnalysisContext context);
    List<NextBestAction> recommendNextActions(OpportunityGap gap);
    QueryIntent parseQueryIntent(String query);
}
```

**Dependencies**:
- GeminiAIClient
- DataQueryService
- VisualizationEngine
- InsightGenerator

#### 3. IntegrationService

**Responsibility**: Orchestration untuk external data integration dan synchronization.

**Key Methods**:
```java
public interface IntegrationService {
    void syncMerchantDirectory();
    void syncDemographicData();
    void syncPOIData();
    void syncCompetitorData();
    List<ExternalMerchant> fetchExternalMerchants(GeoArea area);
    DemographicProfile fetchDemographics(String areaId);
    List<PointOfInterest> fetchPOIs(GeoArea area);
}
```

**Dependencies**:
- MerchantDirectoryClient
- BPSAPIClient
- GooglePlacesClient
- CompetitorDataClient
- DataMatchingService

#### 4. NotificationService

**Responsibility**: Event detection dan notification delivery.

**Key Methods**:
```java
public interface NotificationService {
    void sendNotification(Notification notification);
    List<Notification> getUserNotifications(String userId, boolean unreadOnly);
    void markAsRead(String notificationId);
    void updateUserPreferences(String userId, NotificationPreferences prefs);
    void detectAndNotifyOpportunityGaps();
    void detectAndNotifyPerformanceDrops();
}
```

### API Endpoints

#### Territorial Intelligence APIs

```
GET  /api/v1/territorial/heatmap
     Query Params: metric, level, areaId, filters
     Response: HeatmapData

GET  /api/v1/territorial/clusters
     Query Params: level, areaId, bounds
     Response: List<ClusterData>

GET  /api/v1/territorial/drilldown/{level}/{id}
     Response: TerritorialStats

POST /api/v1/territorial/custom-area/analyze
     Body: CustomArea
     Response: CustomAreaAnalysis

GET  /api/v1/territorial/boundaries
     Query Params: level, parentId
     Response: List<AdministrativeBoundary>
```

#### AI Analytics APIs

```
POST /api/v1/ai/query
     Body: { query: string, sessionId: string }
     Response: AIResponse

GET  /api/v1/ai/insights/{areaId}
     Query Params: insightTypes
     Response: List<Insight>

GET  /api/v1/ai/next-best-actions
     Query Params: areaId, context
     Response: List<NextBestAction>

POST /api/v1/ai/visualization/generate
     Body: { intent: QueryIntent, data: QueryResult }
     Response: Visualization
```

#### Integration APIs

```
GET  /api/v1/integration/merchants/external
     Query Params: bounds, category
     Response: List<ExternalMerchant>

GET  /api/v1/integration/demographics/{areaId}
     Response: DemographicProfile

GET  /api/v1/integration/pois
     Query Params: bounds, categories
     Response: List<PointOfInterest>

GET  /api/v1/integration/competitors
     Query Params: bounds
     Response: CompetitorData

POST /api/v1/integration/sync
     Body: { dataSource: string }
     Response: SyncStatus
```

#### Notification APIs

```
GET  /api/v1/notifications
     Query Params: unreadOnly
     Response: List<Notification>

PUT  /api/v1/notifications/{id}/read
     Response: Success

PUT  /api/v1/notifications/preferences
     Body: NotificationPreferences
     Response: Success

WebSocket: /ws/notifications
     Real-time notification push
```



## Data Models

### Core Entities

#### Merchant

```java
@Entity
@Table(name = "merchants", indexes = {
    @Index(name = "idx_merchant_location", columnList = "location"),
    @Index(name = "idx_merchant_status", columnList = "acquisition_status")
})
public class Merchant {
    @Id
    private String id;
    
    private String name;
    private String category;
    
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location; // PostGIS geometry type
    
    @Enumerated(EnumType.STRING)
    private AcquisitionStatus acquisitionStatus; // ACQUIRED, POTENTIAL, LOST
    
    private BigDecimal casaValue;
    private LocalDate acquisitionDate;
    
    @ManyToOne
    @JoinColumn(name = "rm_id")
    private RelationshipManager assignedRM;
    
    @ManyToOne
    @JoinColumn(name = "subdistrict_id")
    private SubDistrict subDistrict;
    
    private String contactInfo;
    private BigDecimal estimatedRevenue;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

#### AdministrativeBoundary

```java
@Entity
@Table(name = "administrative_boundaries")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AdministrativeBoundary {
    @Id
    private String id;
    
    private String name;
    private String code;
    
    @Column(columnDefinition = "geometry(MultiPolygon,4326)")
    private MultiPolygon boundary; // PostGIS geometry
    
    @Enumerated(EnumType.STRING)
    private AdministrativeLevel level; // PROVINCE, CITY, DISTRICT, SUBDISTRICT
    
    @Column(name = "parent_id")
    private String parentId;
}

@Entity
@Table(name = "provinces")
public class Province extends AdministrativeBoundary {
    @OneToMany(mappedBy = "province")
    private List<City> cities;
}

@Entity
@Table(name = "cities")
public class City extends AdministrativeBoundary {
    @ManyToOne
    @JoinColumn(name = "province_id")
    private Province province;
    
    @OneToMany(mappedBy = "city")
    private List<District> districts;
}

@Entity
@Table(name = "districts")
public class District extends AdministrativeBoundary {
    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;
    
    @OneToMany(mappedBy = "district")
    private List<SubDistrict> subDistricts;
}

@Entity
@Table(name = "subdistricts")
public class SubDistrict extends AdministrativeBoundary {
    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;
    
    @OneToMany(mappedBy = "subDistrict")
    private List<Merchant> merchants;
}
```

#### DemographicData

```java
@Entity
@Table(name = "demographic_data")
public class DemographicData {
    @Id
    private String id;
    
    @Column(name = "area_id")
    private String areaId; // Reference to administrative boundary
    
    @Enumerated(EnumType.STRING)
    private AdministrativeLevel areaLevel;
    
    private Long population;
    
    @Embedded
    private AgeDistribution ageDistribution;
    
    @Embedded
    private EducationLevel educationLevel;
    
    private BigDecimal averageIncome;
    private BigDecimal pdrb; // Produk Domestik Regional Bruto
    private Double economicGrowthRate;
    private Double unemploymentRate;
    private BigDecimal purchasingPower;
    
    private Integer year;
    private Integer quarter;
    
    @Column(name = "data_source")
    private String dataSource; // BPS, etc.
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

@Embeddable
public class AgeDistribution {
    private Integer age0to14;
    private Integer age15to24;
    private Integer age25to54;
    private Integer age55to64;
    private Integer age65Plus;
}

@Embeddable
public class EducationLevel {
    private Integer noSchool;
    private Integer elementary;
    private Integer juniorHigh;
    private Integer seniorHigh;
    private Integer diploma;
    private Integer bachelor;
    private Integer postgraduate;
}
```

#### PointOfInterest

```java
@Entity
@Table(name = "points_of_interest", indexes = {
    @Index(name = "idx_poi_location", columnList = "location"),
    @Index(name = "idx_poi_category", columnList = "category")
})
public class PointOfInterest {
    @Id
    private String id;
    
    private String name;
    
    @Enumerated(EnumType.STRING)
    private POICategory category; // TRADITIONAL_MARKET, MALL, CULINARY_CENTER, 
                                   // INDUSTRIAL_AREA, BUSINESS_DISTRICT
    
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location;
    
    private Integer estimatedTraffic;
    private String address;
    
    @Column(name = "external_id")
    private String externalId; // Google Places ID
    
    @Column(name = "data_source")
    private String dataSource;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

#### ExternalMerchant

```java
@Entity
@Table(name = "external_merchants", indexes = {
    @Index(name = "idx_ext_merchant_location", columnList = "location"),
    @Index(name = "idx_ext_merchant_matched", columnList = "matched_merchant_id")
})
public class ExternalMerchant {
    @Id
    private String id;
    
    private String name;
    private String category;
    
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location;
    
    private BigDecimal estimatedRevenue;
    private String contactInfo;
    
    @Column(name = "external_source")
    private String externalSource; // Merchant directory name
    
    @Column(name = "external_id")
    private String externalId;
    
    @Column(name = "matched_merchant_id")
    private String matchedMerchantId; // Link to internal Merchant if matched
    
    @Column(name = "match_confidence")
    private Double matchConfidence;
    
    @Column(name = "last_synced")
    private LocalDateTime lastSynced;
}
```

#### CompetitorData

```java
@Entity
@Table(name = "competitor_data", indexes = {
    @Index(name = "idx_competitor_location", columnList = "location")
})
public class CompetitorData {
    @Id
    private String id;
    
    private String competitorName;
    
    @Enumerated(EnumType.STRING)
    private CompetitorTouchpointType type; // BRANCH, ATM, AGENT
    
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location;
    
    private String address;
    private LocalDate openingDate;
    
    @Column(name = "data_source")
    private String dataSource;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

#### CustomArea

```java
@Entity
@Table(name = "custom_areas")
public class CustomArea {
    @Id
    private String id;
    
    private String name;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private AreaType type; // CIRCLE, RECTANGLE, POLYGON
    
    @Column(columnDefinition = "geometry(Geometry,4326)")
    private Geometry geometry; // Can be Point+radius, Polygon, etc.
    
    @Column(name = "created_by")
    private String createdBy; // User ID
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Cached analysis results
    @OneToOne(mappedBy = "customArea", cascade = CascadeType.ALL)
    private CustomAreaAnalysis analysis;
}
```

#### TerritorialStats

```java
@Entity
@Table(name = "territorial_stats")
public class TerritorialStats {
    @Id
    private String id;
    
    @Column(name = "area_id")
    private String areaId;
    
    @Enumerated(EnumType.STRING)
    private AdministrativeLevel areaLevel;
    
    private Integer totalMerchants;
    private Integer acquiredMerchants;
    private Integer potentialMerchants;
    
    private BigDecimal totalCasaValue;
    private BigDecimal averageCasaPerMerchant;
    
    private Double penetrationRate; // (acquired / total addressable) * 100
    private BigDecimal estimatedTAM; // Total Addressable Market value
    
    private Integer assignedRMCount;
    private Double averageRMProductivity;
    
    private Double competitiveDensityScore;
    
    @Column(name = "calculation_date")
    private LocalDate calculationDate;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

#### OpportunityGap

```java
@Entity
@Table(name = "opportunity_gaps")
public class OpportunityGap {
    @Id
    private String id;
    
    @Column(name = "area_id")
    private String areaId;
    
    @Enumerated(EnumType.STRING)
    private AdministrativeLevel areaLevel;
    
    private Double gapPercentage; // (potential - acquired) / potential * 100
    
    @Enumerated(EnumType.STRING)
    private SeverityLevel severity; // CRITICAL, HIGH, MEDIUM, LOW
    
    private BigDecimal estimatedRevenuePotential;
    
    @Column(name = "identified_date")
    private LocalDate identifiedDate;
    
    @Enumerated(EnumType.STRING)
    private GapStatus status; // NEW, IN_PROGRESS, RESOLVED, IGNORED
    
    @OneToMany(mappedBy = "opportunityGap")
    private List<NextBestAction> recommendedActions;
}
```

#### AIQuerySession

```java
@Entity
@Table(name = "ai_query_sessions")
public class AIQuerySession {
    @Id
    private String sessionId;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "last_activity")
    private LocalDateTime lastActivity;
    
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    @OrderBy("timestamp ASC")
    private List<QueryHistory> queryHistory;
}

@Entity
@Table(name = "query_history")
public class QueryHistory {
    @Id
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "session_id")
    private AIQuerySession session;
    
    @Column(columnDefinition = "TEXT")
    private String query;
    
    @Column(columnDefinition = "TEXT")
    private String response;
    
    @Enumerated(EnumType.STRING)
    private QueryIntent intent;
    
    private LocalDateTime timestamp;
    
    @Column(name = "processing_time_ms")
    private Long processingTimeMs;
}
```

#### Notification

```java
@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notification_user", columnList = "user_id, is_read")
})
public class Notification {
    @Id
    private String id;
    
    @Column(name = "user_id")
    private String userId;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type; // OPPORTUNITY_GAP, PERFORMANCE_DROP, 
                                    // COMPETITIVE_THREAT, TARGET_ACHIEVEMENT
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Enumerated(EnumType.STRING)
    private NotificationPriority priority; // HIGH, MEDIUM, LOW
    
    @Column(name = "is_read")
    private Boolean isRead;
    
    @Column(name = "related_entity_id")
    private String relatedEntityId; // ID of related area, merchant, etc.
    
    @Column(name = "related_entity_type")
    private String relatedEntityType;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
}
```

### Database Schema Considerations

#### PostGIS Spatial Indexes

```sql
-- Spatial indexes for geospatial queries
CREATE INDEX idx_merchant_location_gist ON merchants USING GIST(location);
CREATE INDEX idx_poi_location_gist ON points_of_interest USING GIST(location);
CREATE INDEX idx_boundary_geometry_gist ON administrative_boundaries USING GIST(boundary);
CREATE INDEX idx_external_merchant_location_gist ON external_merchants USING GIST(location);
CREATE INDEX idx_competitor_location_gist ON competitor_data USING GIST(location);
```

#### Partitioning Strategy

```sql
-- Partition query_history by month for better performance
CREATE TABLE query_history (
    -- columns
) PARTITION BY RANGE (timestamp);

CREATE TABLE query_history_2024_01 PARTITION OF query_history
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
-- Additional monthly partitions...
```



## Integration Patterns

### External Data Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Integration Service Layer                     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Scheduled Sync Jobs (Spring @Scheduled)        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │   │
│  │  │ Merchant   │  │ Demographic│  │ POI Sync   │         │   │
│  │  │ Dir Sync   │  │ Data Sync  │  │ Job        │         │   │
│  │  │ (Daily)    │  │ (Quarterly)│  │ (Weekly)   │         │   │
│  │  └────────────┘  └────────────┘  └────────────┘         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────┴───────────────────────────────┐   │
│  │              External API Clients                        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │   │
│  │  │ Merchant   │  │ BPS API    │  │ Google     │         │   │
│  │  │ Directory  │  │ Client     │  │ Places     │         │   │
│  │  │ Client     │  │            │  │ Client     │         │   │
│  │  └────────────┘  └────────────┘  └────────────┘         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────┴───────────────────────────────┐   │
│  │           Data Transformation & Validation               │   │
│  │  - Schema mapping                                        │   │
│  │  - Data cleansing                                        │   │
│  │  - Coordinate transformation (WGS84)                     │   │
│  │  - Duplicate detection                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌──────────────────────────┴───────────────────────────────┐   │
│  │              Data Matching Service                       │   │
│  │  - Fuzzy name matching                                   │   │
│  │  - Geospatial proximity matching                         │   │
│  │  - Confidence scoring                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

### Integration Service Implementation

#### MerchantDirectoryClient

```java
@Service
public class MerchantDirectoryClient {
    private final RestTemplate restTemplate;
    private final String apiBaseUrl;
    private final String apiKey;
    
    public List<ExternalMerchantDTO> fetchMerchants(GeoArea area, String category) {
        // Call external merchant directory API
        // Handle pagination, rate limiting, retries
        // Transform response to internal DTO
    }
    
    public ExternalMerchantDTO fetchMerchantDetails(String externalId) {
        // Fetch detailed merchant information
    }
}
```

#### DataMatchingService

```java
@Service
public class DataMatchingService {
    
    public MatchResult matchExternalMerchant(ExternalMerchant external, 
                                             List<Merchant> candidates) {
        // Fuzzy name matching using Levenshtein distance
        double nameScore = calculateNameSimilarity(external.getName(), 
                                                   candidates);
        
        // Geospatial proximity matching
        double locationScore = calculateLocationProximity(external.getLocation(), 
                                                          candidates);
        
        // Category matching
        double categoryScore = calculateCategorySimilarity(external.getCategory(), 
                                                           candidates);
        
        // Weighted confidence score
        double confidence = (nameScore * 0.4) + (locationScore * 0.4) + 
                           (categoryScore * 0.2);
        
        return new MatchResult(bestCandidate, confidence);
    }
    
    private double calculateLocationProximity(Point p1, Point p2) {
        // Use PostGIS ST_Distance for accurate geospatial distance
        // Return normalized score (0-1) based on distance threshold
    }
}
```

#### Scheduled Sync Jobs

```java
@Component
public class DataSyncScheduler {
    
    @Autowired
    private IntegrationService integrationService;
    
    @Scheduled(cron = "0 0 2 * * *") // Daily at 2 AM
    public void syncMerchantDirectory() {
        log.info("Starting merchant directory sync");
        try {
            integrationService.syncMerchantDirectory();
            log.info("Merchant directory sync completed");
        } catch (Exception e) {
            log.error("Merchant directory sync failed", e);
            // Send alert to monitoring system
        }
    }
    
    @Scheduled(cron = "0 0 3 1 */3 *") // Quarterly on 1st day at 3 AM
    public void syncDemographicData() {
        log.info("Starting demographic data sync");
        integrationService.syncDemographicData();
    }
    
    @Scheduled(cron = "0 0 4 * * 0") // Weekly on Sunday at 4 AM
    public void syncPOIData() {
        log.info("Starting POI data sync");
        integrationService.syncPOIData();
    }
}
```

### Gemini AI Integration

#### GeminiAIClient

```java
@Service
public class GeminiAIClient {
    private final String apiKey;
    private final String modelName = "gemini-pro";
    
    public GeminiResponse processQuery(String query, String context) {
        // Build prompt with context
        String prompt = buildPrompt(query, context);
        
        // Call Gemini API
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        GeminiRequest request = GeminiRequest.builder()
            .model(modelName)
            .prompt(prompt)
            .temperature(0.7)
            .maxTokens(1024)
            .build();
        
        ResponseEntity<GeminiResponse> response = restTemplate.postForEntity(
            "https://generativelanguage.googleapis.com/v1/models/" + modelName + ":generateContent",
            new HttpEntity<>(request, headers),
            GeminiResponse.class
        );
        
        return response.getBody();
    }
    
    private String buildPrompt(String query, String context) {
        return String.format("""
            You are a business intelligence assistant for BRI Bank.
            
            Context:
            %s
            
            User Query: %s
            
            Provide a clear, actionable response with insights and recommendations.
            If data visualization would help, specify the chart type and data structure.
            """, context, query);
    }
}
```

#### QueryIntent Parser

```java
@Service
public class QueryIntentParser {
    
    @Autowired
    private GeminiAIClient geminiClient;
    
    public QueryIntent parseIntent(String query) {
        // Use Gemini to extract intent and entities
        String intentPrompt = String.format("""
            Analyze this query and extract:
            1. Intent type: DATA_RETRIEVAL, COMPARISON, TREND_ANALYSIS, RECOMMENDATION
            2. Entities: locations, metrics, time periods
            3. Required data sources
            
            Query: %s
            
            Respond in JSON format.
            """, query);
        
        GeminiResponse response = geminiClient.processQuery(intentPrompt, "");
        
        // Parse JSON response to QueryIntent object
        return parseIntentFromResponse(response);
    }
}
```

### Caching Strategy

#### Cache Configuration

```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(5))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Different TTL for different cache types
        cacheConfigurations.put("heatmapData", config.entryTtl(Duration.ofMinutes(5)));
        cacheConfigurations.put("clusterData", config.entryTtl(Duration.ofMinutes(5)));
        cacheConfigurations.put("demographicData", config.entryTtl(Duration.ofHours(24)));
        cacheConfigurations.put("boundaryData", config.entryTtl(Duration.ofDays(7)));
        cacheConfigurations.put("poiData", config.entryTtl(Duration.ofHours(12)));
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .withInitialCacheConfigurations(cacheConfigurations)
            .build();
    }
}
```

#### Cache Usage in Services

```java
@Service
public class TerritorialServiceImpl implements TerritorialService {
    
    @Cacheable(value = "heatmapData", key = "#request.metric + '_' + #request.areaId")
    public HeatmapData generateHeatmap(HeatmapRequest request) {
        // Expensive computation cached for 5 minutes
        return computeHeatmap(request);
    }
    
    @Cacheable(value = "boundaryData", key = "#level + '_' + #parentId")
    public List<AdministrativeBoundary> getBoundaries(String level, String parentId) {
        // Boundary data rarely changes, cache for 7 days
        return boundaryRepository.findByLevelAndParentId(level, parentId);
    }
    
    @CacheEvict(value = "heatmapData", allEntries = true)
    public void refreshHeatmapCache() {
        // Called after data sync to invalidate cache
    }
}
```

### Real-Time Data Synchronization

#### WebSocket Configuration

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOrigins("*")
            .withSockJS();
    }
}
```

#### Real-Time Update Publisher

```java
@Service
public class RealtimeUpdateService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void publishDataUpdate(String topic, Object data) {
        messagingTemplate.convertAndSend("/topic/" + topic, data);
    }
    
    public void publishUserNotification(String userId, Notification notification) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", 
                                               notification);
    }
}

@Component
public class DataChangeListener {
    
    @Autowired
    private RealtimeUpdateService realtimeService;
    
    @EventListener
    public void onMerchantDataChange(MerchantDataChangeEvent event) {
        // Publish update to connected clients
        realtimeService.publishDataUpdate("merchant-updates", event.getData());
    }
}
```



## Security Design

### Role-Based Access Control (RBAC)

#### Role Hierarchy

```
Admin
  └─ Regional Manager
      └─ Area Manager
          └─ RM (Relationship Manager)
              └─ Analyst (Read-only)
```

#### Permission Matrix

| Feature | Admin | Regional Manager | Area Manager | RM | Analyst |
|---------|-------|------------------|--------------|-----|---------|
| View All Regions | ✓ | ✓ (assigned only) | ✗ | ✗ | ✗ |
| View All Areas | ✓ | ✓ (in region) | ✓ (assigned only) | ✗ | ✗ |
| View Merchant Details | ✓ | ✓ | ✓ | ✓ (assigned only) | ✓ |
| Create Custom Areas | ✓ | ✓ | ✓ | ✓ | ✗ |
| Export Data | ✓ | ✓ | ✓ | ✓ (limited) | ✓ (limited) |
| AI Analytics | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage Users | ✓ | ✗ | ✗ | ✗ | ✗ |
| Configure Integrations | ✓ | ✗ | ✗ | ✗ | ✗ |
| View Audit Logs | ✓ | ✓ (own region) | ✗ | ✗ | ✗ |

#### Security Implementation

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/territorial/**").hasAnyRole("ADMIN", "REGIONAL_MANAGER", "AREA_MANAGER", "RM", "ANALYST")
                .requestMatchers("/api/v1/ai/**").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

#### Data Access Control

```java
@Service
public class DataAccessControlService {
    
    public boolean canAccessArea(User user, String areaId) {
        switch (user.getRole()) {
            case ADMIN:
                return true;
            case REGIONAL_MANAGER:
                return isAreaInUserRegion(user, areaId);
            case AREA_MANAGER:
                return user.getAssignedAreas().contains(areaId);
            case RM:
                return isAreaAssignedToRM(user, areaId);
            default:
                return false;
        }
    }
    
    public List<Merchant> filterMerchantsByAccess(User user, List<Merchant> merchants) {
        if (user.getRole() == Role.ADMIN) {
            return merchants;
        }
        
        if (user.getRole() == Role.RM) {
            // RM can only see their assigned merchants
            return merchants.stream()
                .filter(m -> m.getAssignedRM().getId().equals(user.getId()))
                .collect(Collectors.toList());
        }
        
        // Filter by geographic assignment
        Set<String> allowedAreaIds = getUserAllowedAreas(user);
        return merchants.stream()
            .filter(m -> allowedAreaIds.contains(m.getSubDistrict().getId()))
            .collect(Collectors.toList());
    }
}
```

#### Audit Logging

```java
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    private String id;
    
    @Column(name = "user_id")
    private String userId;
    
    private String action; // VIEW, CREATE, UPDATE, DELETE, EXPORT
    private String entityType; // MERCHANT, AREA, REPORT, etc.
    private String entityId;
    
    @Column(columnDefinition = "TEXT")
    private String details;
    
    private String ipAddress;
    private String userAgent;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
}

@Aspect
@Component
public class AuditAspect {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    @Around("@annotation(Audited)")
    public Object auditMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        // Extract user from security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Log the action
        AuditLog log = new AuditLog();
        log.setUserId(auth.getName());
        log.setAction(extractAction(joinPoint));
        log.setTimestamp(LocalDateTime.now());
        
        Object result = joinPoint.proceed();
        
        auditLogRepository.save(log);
        
        return result;
    }
}
```

### API Security

#### Rate Limiting

```java
@Component
public class RateLimitingFilter extends OncePerRequestFilter {
    
    private final RateLimiter rateLimiter = RateLimiter.create(100.0); // 100 requests/sec
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String userId = extractUserId(request);
        
        if (!rateLimiter.tryAcquire()) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Rate limit exceeded");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}
```

#### Input Validation

```java
public class HeatmapRequest {
    @NotNull
    @Pattern(regexp = "penetration|casa|density|productivity")
    private String metric;
    
    @NotNull
    @Pattern(regexp = "province|city|district|subdistrict")
    private String level;
    
    @NotBlank
    private String areaId;
    
    // Prevent SQL injection in custom queries
    @ValidSQLIdentifier
    private String customFilter;
}

@Constraint(validatedBy = SQLIdentifierValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidSQLIdentifier {
    String message() default "Invalid SQL identifier";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Territorial Intelligence Properties

#### Property 1: Heatmap Data Completeness

*For any* heatmap request with a valid metric and area, the generated heatmap data should contain color gradations for all sub-areas within the requested area, with each sub-area having a metric value and corresponding color.

**Validates: Requirements 1.1**

#### Property 2: Tooltip Metric Accuracy

*For any* area on a rendered heatmap, hovering over that area should display a tooltip containing the exact metric value used to determine that area's color in the heatmap.

**Validates: Requirements 1.5**

#### Property 3: Cluster Generation from Merchant Data

*For any* set of merchant data loaded into the system, cluster analysis should produce at least one cluster, and the union of all merchants in all clusters should equal the original merchant set.

**Validates: Requirements 2.1**

#### Property 4: Cluster Size Proportionality

*For any* two clusters displayed on the map, if cluster A contains more merchants than cluster B, then the visual radius of cluster A should be greater than or equal to the visual radius of cluster B.

**Validates: Requirements 2.2**

#### Property 5: Cluster Breakdown Completeness

*For any* cluster marker, clicking it should display a breakdown containing merchant count, average CASA value, and acquisition status distribution, with the merchant count matching the cluster's actual size.

**Validates: Requirements 2.3**

#### Property 6: Cluster Decomposition on Zoom

*For any* cluster at zoom level Z, zooming in to level Z+1 should either break the cluster into individual markers or into multiple sub-clusters, such that no single cluster at Z+1 contains all the merchants from the original cluster at Z.

**Validates: Requirements 2.5**

#### Property 7: Drill-Down Navigation Consistency

*For any* administrative area at level L (where L < Kelurahan), clicking the area should navigate to level L+1 and display only sub-areas that are children of the clicked area.

**Validates: Requirements 3.2**

#### Property 8: Breadcrumb Hierarchy Accuracy

*For any* navigation state at administrative level L with parent chain P, the breadcrumb should display all levels from root to L in order, matching the actual parent-child relationships in P.

**Validates: Requirements 3.3**

#### Property 9: Kelurahan Detail Data Completeness

*For any* kelurahan-level view, the displayed data should include merchant count, assigned RM list, penetration rate, and demographic summary fields.

**Validates: Requirements 3.4**

#### Property 10: Parent Level Navigation

*For any* administrative level L where L > Provinsi, the back button should navigate to level L-1 and display the parent area of the current area.

**Validates: Requirements 3.5**

#### Property 11: Filter Application Consistency

*For any* filter selection at any administrative level, all visualizations and statistics should reflect only the data within the selected geographic boundaries.

**Validates: Requirements 4.2**

#### Property 12: Filter State Persistence Across Tabs

*For any* filter state F applied in tab T1, navigating to tab T2 and back to T1 should preserve filter state F exactly.

**Validates: Requirements 4.3**

#### Property 13: Multi-Selection Aggregation

*For any* set of N selected kelurahan, the displayed statistics should equal the sum/average (as appropriate) of the individual statistics from each of the N kelurahan.

**Validates: Requirements 4.4**

#### Property 14: Custom Area Spatial Query Accuracy

*For any* custom area geometry G drawn on the map, the system should return all and only those merchants and POIs whose coordinates fall within the boundaries of G.

**Validates: Requirements 5.2**

#### Property 15: Custom Area Summary Completeness

*For any* custom area analysis, the summary should contain total merchants, acquired vs potential counts, estimated TAM value, and demographic profile fields.

**Validates: Requirements 5.3**

#### Property 16: Custom Area Persistence Round-Trip

*For any* custom area with geometry G and metadata M, saving the area and then loading it should return geometry G' and metadata M' such that G' is spatially equivalent to G and M' equals M.

**Validates: Requirements 5.4, 5.5**

### AI Analytics Properties

#### Property 17: Natural Language Query Processing

*For any* valid query in Indonesian or English, the AI engine should extract at least one intent and return a response in the same language as the query.

**Validates: Requirements 6.1**

#### Property 18: Data Query Execution

*For any* query requiring specific data retrieval, the AI response should include data results formatted in natural language that accurately reflect the queried database state.

**Validates: Requirements 6.3**

#### Property 19: Ambiguity Handling

*For any* query that the AI engine classifies as ambiguous (confidence < threshold), the response should contain a follow-up question requesting clarification.

**Validates: Requirements 6.4**

#### Property 20: Query History Persistence

*For any* query Q submitted in session S, retrieving the history for session S should include query Q with its timestamp and response.

**Validates: Requirements 6.5**

#### Property 21: Auto-Visualization Generation

*For any* query that the AI engine determines requires visualization, the response should include a generated visualization object with a valid chart type and data structure.

**Validates: Requirements 7.1**

#### Property 22: Visualization Type Selection

*For any* data result of type T (comparison/trend/composition/geospatial), the auto-generated visualization should use the appropriate chart type (bar/line/pie/map respectively).

**Validates: Requirements 7.2**

#### Property 23: Visualization UI Features

*For any* generated visualization, it should be rendered with an "Expand to Full Screen" option available in the UI.

**Validates: Requirements 7.3**

#### Property 24: Visualization Export Validity

*For any* visualization, exporting it in PNG or PDF format should produce a valid file of the requested format that can be opened by standard viewers.

**Validates: Requirements 7.4**

#### Property 25: Visualization Modification

*For any* visualization V and modification request R, the AI engine should generate a new visualization V' that incorporates the changes specified in R.

**Validates: Requirements 7.5**

#### Property 26: Multi-Type Insight Completeness

*For any* analysis request, the generated insights should include at least one insight from each of the four categories: descriptive, diagnostic, predictive, and prescriptive.

**Validates: Requirements 8.1**

#### Property 27: Prescriptive Insight Structure

*For any* prescriptive insight, it should include a confidence score (0-1) and an expected impact value.

**Validates: Requirements 8.4**

#### Property 28: Insight Visual Differentiation

*For any* two insights of different types (descriptive vs diagnostic vs predictive vs prescriptive), they should have different visual indicators (icon or color).

**Validates: Requirements 8.5**

#### Property 29: Next Best Action Generation

*For any* opportunity gap analysis, the system should generate a ranked list of next best actions with at least one action.

**Validates: Requirements 9.1**

#### Property 30: Minimum Recommendation Count with Priorities

*For any* next best action list, it should contain at least 3 recommendations, each with a priority level (High/Medium/Low).

**Validates: Requirements 9.2**

#### Property 31: Recommendation Structure Completeness

*For any* next best action recommendation, it should include action description, expected outcome, required resources, and estimated timeline fields.

**Validates: Requirements 9.3**

#### Property 32: Action Plan Creation

*For any* next best action recommendation, triggering "Create Action Plan" should generate a task assignment record linked to the appropriate RM.

**Validates: Requirements 9.5**

### Data Integration Properties

#### Property 33: External Merchant Visual Differentiation

*For any* external merchant displayed on the map, its marker should be visually distinct (different icon or color) from acquired merchant markers.

**Validates: Requirements 10.2**

#### Property 34: External Merchant Detail Completeness

*For any* external merchant, clicking it should display details including name, category, estimated revenue, and contact info (if available).

**Validates: Requirements 10.3**

#### Property 35: TAM Calculation Accuracy

*For any* area, the calculated TAM should equal the count of external merchants in that area that are not matched to any acquired internal merchant.

**Validates: Requirements 10.4**

#### Property 36: Merchant Matching Detection

*For any* external merchant E that has a high similarity (name, location, category) to an internal merchant I, the data matching service should identify I as a match for E with a confidence score.

**Validates: Requirements 10.5**

#### Property 37: Demographic Profile Completeness

*For any* administrative area at any level, the demographic profile should include population, age distribution, education level, and average income fields.

**Validates: Requirements 11.1**

#### Property 38: Economic Indicator Completeness

*For any* administrative area, the economic indicators should include PDRB, economic growth rate, unemployment rate, and purchasing power fields.

**Validates: Requirements 11.2**

#### Property 39: Drill-Down Demographic Specificity

*For any* kelurahan K, the demographic data displayed should be specific to K and not aggregated from parent levels, verifiable by comparing with sibling kelurahan data.

**Validates: Requirements 11.3**

#### Property 40: POI Category Icon Uniqueness

*For any* two POIs of different categories, they should be displayed with different icons on the map.

**Validates: Requirements 12.1**

#### Property 41: POI Category Filter Effectiveness

*For any* POI category filter applied, the map should display only POIs of the selected categories and hide all others.

**Validates: Requirements 12.2**

#### Property 42: POI Detail Completeness

*For any* POI, clicking it should display name, category, estimated traffic, and merchant density within 500m radius.

**Validates: Requirements 12.3**

#### Property 43: Merchant Proximity Score Calculation

*For any* merchant M, the proximity score should be inversely related to the distance to the nearest POI (closer POI = higher score).

**Validates: Requirements 12.4**

#### Property 44: Competitor Touchpoint Visual Distinction

*For any* competitor branch or ATM displayed on the map, it should have a marker visually distinct from BRI touchpoints.

**Validates: Requirements 13.1**

#### Property 45: Competitive Density Score Calculation

*For any* area A, the competitive density score should be proportional to the count of competitor touchpoints within A.

**Validates: Requirements 13.2**

#### Property 46: Market Share Estimation Display

*For any* selected area, the market share display should show a breakdown of BRI vs competitor percentages that sum to 100%.

**Validates: Requirements 13.3**

#### Property 47: Competitive Proximity Alert

*For any* new competitor branch within 2km of a BRI branch, the system should generate a competitive threat alert.

**Validates: Requirements 13.4**

### Opportunity Analysis Properties

#### Property 48: Penetration Rate Formula Accuracy

*For any* area with A acquired merchants and T total addressable merchants, the penetration rate should equal (A / T) × 100%.

**Validates: Requirements 14.1**

#### Property 49: Opportunity Gap Identification

*For any* area with TAM above threshold T and penetration rate below threshold P, the system should identify it as an opportunity gap.

**Validates: Requirements 14.2**

#### Property 50: Opportunity Gap Severity Classification

*For any* identified opportunity gap with gap percentage G, the severity level should be: Critical if G > 70%, High if 50% ≤ G ≤ 70%, Medium if 30% ≤ G < 50%, Low if G < 30%.

**Validates: Requirements 14.3**

#### Property 51: Opportunity Gap Report Completeness

*For any* opportunity gap, the generated report should include area identifier, gap size, estimated revenue potential, and recommended actions.

**Validates: Requirements 14.4**

#### Property 52: Opportunity Gap Prioritization

*For any* set of opportunity gaps, they should be ranked such that gaps with higher combined scores (considering gap size, accessibility, demographic fit, competitive pressure) appear first.

**Validates: Requirements 14.5**

### System Behavior Properties

#### Property 53: Real-Time Visualization Update

*For any* data change event E, all connected clients viewing affected visualizations should receive an update within 5 seconds without requiring manual page refresh.

**Validates: Requirements 15.2**

#### Property 54: Last Updated Timestamp Display

*For any* widget or visualization, it should display a "Last Updated" timestamp that reflects the most recent data refresh time.

**Validates: Requirements 15.3**

#### Property 55: Sync Failure Handling

*For any* data synchronization failure, the system should display a warning indicator and schedule an automatic retry after 5 minutes.

**Validates: Requirements 15.4**

#### Property 56: Manual Refresh Trigger

*For any* dashboard state, clicking the manual refresh button should trigger an immediate data fetch and update all visualizations with the latest data.

**Validates: Requirements 15.5**

#### Property 57: Export Content Completeness

*For any* dashboard export, the generated file should include all active visualizations, current statistics, and applied filters.

**Validates: Requirements 16.2**

#### Property 58: Export Template Customization

*For any* report template, it should support customization with BRI logo and branding elements.

**Validates: Requirements 16.3**

#### Property 59: Raw Data Export Metadata

*For any* raw data export, the file should include metadata: export date, user ID, and filter criteria applied.

**Validates: Requirements 16.4**

#### Property 60: Async Export with Notification

*For any* export request, the system should process it in the background and send a notification to the user when the file is ready for download.

**Validates: Requirements 16.5**

### Security and Access Control Properties

#### Property 61: Role-Based Feature Access

*For any* user with role R, the displayed dashboard features should match exactly the permissions defined for role R in the permission matrix.

**Validates: Requirements 17.2**

#### Property 62: Geographic Data Access Control

*For any* user U with geographic assignment G, all data queries should return only data within boundaries of G (or subset of G for lower roles).

**Validates: Requirements 17.3**

#### Property 63: Audit Log Completeness

*For any* user action A (view/create/update/delete/export), an audit log entry should be created containing user ID, action type, entity type, entity ID, and timestamp.

**Validates: Requirements 17.4**

#### Property 64: Real-Time Permission Update

*For any* user U whose role is changed from R1 to R2 by an admin, user U's access permissions should update to R2's permissions immediately without requiring re-login.

**Validates: Requirements 17.5**

### Performance Properties

#### Property 65: Marker Display Limit

*For any* map viewport, the number of simultaneously rendered markers should not exceed 1000, with additional markers shown as clusters.

**Validates: Requirements 18.1**

#### Property 66: Incremental Data Loading

*For any* viewport change (zoom or pan), only data for the new viewport area that wasn't previously loaded should be fetched from the server.

**Validates: Requirements 18.2**

#### Property 67: Loading Indicator Display

*For any* query or operation taking longer than 1 second, a loading indicator should be displayed to the user.

**Validates: Requirements 18.3**

#### Property 68: Cache Hit for Frequent Data

*For any* data request for frequently accessed data within the TTL window (5 minutes), the data should be served from cache without hitting the database.

**Validates: Requirements 18.4**

### Responsive Design Properties

#### Property 69: Minimum Screen Width Support

*For any* device with screen width W ≥ 360px, the dashboard should render without horizontal scrolling and all interactive elements should be accessible.

**Validates: Requirements 19.1**

#### Property 70: Mobile Layout Adaptation

*For any* mobile viewport (width < 768px), the dashboard should display in single-column layout with collapsible sidebar and touch-friendly controls.

**Validates: Requirements 19.2**

#### Property 71: Touch Gesture Support

*For any* touch gesture (pinch-to-zoom, swipe-to-pan, tap-to-select) on the map component, the map should respond with the appropriate action.

**Validates: Requirements 19.3**

#### Property 72: Mobile View Simplification

*For any* mobile viewport, the dashboard should display a simplified view focusing on key metrics and map, with detailed tables accessible via drill-down.

**Validates: Requirements 19.4**

#### Property 73: Cross-Viewport State Persistence

*For any* filter and navigation state S in viewport V1, switching to viewport V2 (e.g., desktop to mobile) should preserve state S.

**Validates: Requirements 19.5**

### Notification Properties

#### Property 74: Event-Based Notification Trigger

*For any* specified event (opportunity gap detected, performance drop, competitive threat, target achievement), the system should generate and send a notification to relevant users.

**Validates: Requirements 20.1**

#### Property 75: Notification Center Completeness

*For any* notification sent to user U, it should appear in user U's notification center with correct read/unread status.

**Validates: Requirements 20.2**

#### Property 76: Badge Counter Accuracy

*For any* user U with N unread notifications, the bell icon badge should display count N.

**Validates: Requirements 20.3**

#### Property 77: Notification Preference Enforcement

*For any* user U with notification preferences P (email/in-app/both), notifications should be delivered only through channels specified in P.

**Validates: Requirements 20.4**

#### Property 78: Notification Navigation Context

*For any* notification N related to entity E, clicking N should navigate to the appropriate view for E with relevant context (filters, drill-down level) pre-applied.

**Validates: Requirements 20.5**



## Error Handling

### Error Categories and Handling Strategies

#### 1. External API Failures

**Scenarios**:
- Gemini AI API timeout or rate limit
- Google Places API unavailable
- BPS API returns invalid data
- Merchant Directory API authentication failure

**Handling Strategy**:
```java
@Service
public class ResilientExternalAPIClient {
    
    @Retry(name = "externalAPI", fallbackMethod = "fallbackResponse")
    @CircuitBreaker(name = "externalAPI")
    @RateLimiter(name = "externalAPI")
    public ExternalDataResponse callExternalAPI(ExternalAPIRequest request) {
        // API call implementation
    }
    
    private ExternalDataResponse fallbackResponse(ExternalAPIRequest request, Exception e) {
        log.error("External API call failed, using fallback", e);
        
        // Return cached data if available
        Optional<ExternalDataResponse> cached = cacheService.get(request.getCacheKey());
        if (cached.isPresent()) {
            return cached.get().withStaleDataWarning();
        }
        
        // Return empty response with error indicator
        return ExternalDataResponse.empty()
            .withError("External service temporarily unavailable");
    }
}
```

**User Experience**:
- Display warning banner: "Some data may be outdated due to external service issues"
- Show last successful sync timestamp
- Provide manual retry option
- Degrade gracefully: show available data, hide unavailable features

#### 2. Geospatial Query Errors

**Scenarios**:
- Invalid geometry (self-intersecting polygon)
- Coordinates outside valid range
- PostGIS query timeout for complex geometries
- Spatial index corruption

**Handling Strategy**:
```java
@Service
public class GeospatialService {
    
    public List<Merchant> findMerchantsInArea(Geometry area) {
        try {
            // Validate geometry
            if (!area.isValid()) {
                throw new InvalidGeometryException("Geometry is not valid: " + 
                    new IsValidOp(area).getValidationError().getMessage());
            }
            
            // Simplify complex geometries to prevent timeout
            if (area.getNumPoints() > 1000) {
                area = TopologyPreservingSimplifier.simplify(area, 0.0001);
            }
            
            // Execute spatial query with timeout
            return merchantRepository.findWithinGeometry(area, Duration.ofSeconds(10));
            
        } catch (InvalidGeometryException e) {
            log.error("Invalid geometry provided", e);
            throw new BadRequestException("Invalid area selection: " + e.getMessage());
            
        } catch (QueryTimeoutException e) {
            log.error("Spatial query timeout", e);
            throw new ServiceException("Area too complex, please select a smaller area");
        }
    }
}
```

**User Experience**:
- Validate geometry client-side before submission
- Show error message: "Invalid area selection, please redraw"
- For timeout: "Selected area is too large, please select a smaller region"
- Suggest alternative: "Try using administrative boundaries instead"

#### 3. Data Synchronization Failures

**Scenarios**:
- Network interruption during sync
- Data format mismatch
- Duplicate key violations
- Transaction rollback

**Handling Strategy**:
```java
@Service
public class DataSyncService {
    
    @Transactional
    public SyncResult syncExternalMerchants() {
        SyncResult result = new SyncResult();
        
        try {
            List<ExternalMerchantDTO> externalData = merchantDirectoryClient.fetchAll();
            
            for (ExternalMerchantDTO dto : externalData) {
                try {
                    // Validate and transform
                    ExternalMerchant merchant = transformAndValidate(dto);
                    
                    // Upsert with conflict resolution
                    externalMerchantRepository.upsert(merchant);
                    result.incrementSuccess();
                    
                } catch (ValidationException e) {
                    log.warn("Skipping invalid merchant data", e);
                    result.addError(dto.getId(), e.getMessage());
                    
                } catch (DataIntegrityViolationException e) {
                    log.warn("Duplicate merchant, updating existing", e);
                    externalMerchantRepository.update(merchant);
                    result.incrementUpdated();
                }
            }
            
            // Update sync status
            syncStatusRepository.save(new SyncStatus(
                "merchant_directory", 
                LocalDateTime.now(), 
                result
            ));
            
        } catch (Exception e) {
            log.error("Sync failed", e);
            result.setFailed(true);
            
            // Schedule retry
            scheduleRetry(Duration.ofMinutes(5));
        }
        
        return result;
    }
}
```

**User Experience**:
- Display sync status indicator (success/warning/error)
- Show sync statistics: "Synced 1,234 merchants, 5 errors"
- Provide error details in admin panel
- Auto-retry with exponential backoff

#### 4. AI Query Processing Errors

**Scenarios**:
- Gemini API returns malformed response
- Query intent cannot be determined
- Required data not available
- Query result too large to process

**Handling Strategy**:
```java
@Service
public class AIAnalyticsService {
    
    public AIResponse processQuery(String query, String userId) {
        try {
            // Parse intent with timeout
            QueryIntent intent = queryIntentParser.parseIntent(query, Duration.ofSeconds(5));
            
            if (intent.getConfidence() < 0.5) {
                return AIResponse.clarificationRequest(
                    "I'm not sure I understood. Could you rephrase your question?"
                );
            }
            
            // Execute data query with result size limit
            QueryResult data = dataQueryService.execute(intent, MAX_RESULT_SIZE);
            
            if (data.isEmpty()) {
                return AIResponse.noData(
                    "I couldn't find any data matching your query. Try adjusting your filters."
                );
            }
            
            // Generate response
            String response = geminiClient.generateResponse(query, data);
            
            return AIResponse.success(response, data);
            
        } catch (TimeoutException e) {
            log.error("AI query timeout", e);
            return AIResponse.error(
                "The query is taking too long. Please try a more specific question."
            );
            
        } catch (GeminiAPIException e) {
            log.error("Gemini API error", e);
            return AIResponse.error(
                "AI service is temporarily unavailable. Please try again later."
            );
            
        } catch (Exception e) {
            log.error("Unexpected error processing query", e);
            return AIResponse.error(
                "An error occurred processing your query. Please try again."
            );
        }
    }
}
```

**User Experience**:
- Show typing indicator while processing
- Display clarification questions naturally in chat
- Provide query suggestions for common questions
- Show "Try again" button on errors

#### 5. Authentication and Authorization Errors

**Scenarios**:
- JWT token expired
- User accessing unauthorized data
- Role change during active session
- Concurrent session limit exceeded

**Handling Strategy**:
```java
@Component
public class SecurityExceptionHandler {
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException e) {
        log.warn("Access denied: {}", e.getMessage());
        
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(new ErrorResponse(
                "ACCESS_DENIED",
                "You don't have permission to access this resource",
                null
            ));
    }
    
    @ExceptionHandler(JwtExpiredException.class)
    public ResponseEntity<ErrorResponse> handleTokenExpired(JwtExpiredException e) {
        log.info("JWT token expired for user: {}", e.getUserId());
        
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse(
                "TOKEN_EXPIRED",
                "Your session has expired. Please log in again.",
                Map.of("redirectTo", "/login")
            ));
    }
}
```

**User Experience**:
- Auto-redirect to login on token expiration
- Show clear error message: "You don't have access to this area"
- Provide "Request Access" button for unauthorized resources
- Gracefully handle role changes: refresh permissions without logout

#### 6. Performance and Resource Errors

**Scenarios**:
- Database connection pool exhausted
- Memory limit exceeded for large exports
- Too many concurrent users
- Cache server unavailable

**Handling Strategy**:
```java
@Configuration
public class ResourceManagementConfig {
    
    @Bean
    public HikariDataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setMaximumPoolSize(50);
        config.setMinimumIdle(10);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        
        return new HikariDataSource(config);
    }
    
    @Bean
    public ThreadPoolTaskExecutor exportExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        
        return executor;
    }
}

@Service
public class ExportService {
    
    @Async("exportExecutor")
    public CompletableFuture<ExportResult> exportDashboard(ExportRequest request) {
        try {
            // Stream large datasets instead of loading all into memory
            return CompletableFuture.completedFuture(
                streamingExportService.export(request)
            );
            
        } catch (OutOfMemoryError e) {
            log.error("Export too large", e);
            return CompletableFuture.completedFuture(
                ExportResult.error("Export size exceeds limit. Please apply filters to reduce data size.")
            );
        }
    }
}
```

**User Experience**:
- Show queue position for exports: "Your export is #3 in queue"
- Provide progress indicator for long operations
- Suggest data reduction: "Try filtering by date range to reduce export size"
- Graceful degradation: disable non-critical features under high load

### Error Response Format

All API errors follow consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": {
      "field": "specific_field",
      "reason": "validation_failed"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456"
  }
}
```

### Monitoring and Alerting

```java
@Component
public class ErrorMonitoring {
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    public void recordError(String errorType, Exception e) {
        // Increment error counter
        meterRegistry.counter("application.errors", 
            "type", errorType,
            "exception", e.getClass().getSimpleName()
        ).increment();
        
        // Alert on critical errors
        if (isCritical(errorType)) {
            alertService.sendAlert(
                "Critical Error",
                String.format("Error type: %s, Message: %s", errorType, e.getMessage())
            );
        }
    }
}
```



## Testing Strategy

### Dual Testing Approach

This system requires both unit testing and property-based testing for comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, error conditions, and integration points between components
- **Property Tests**: Verify universal properties across all inputs using randomized test data generation

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness across the input space.

### Property-Based Testing Framework

**Java Backend**: Use [jqwik](https://jqwik.net/) for property-based testing

```xml
<dependency>
    <groupId>net.jqwik</groupId>
    <artifactId>jqwik</artifactId>
    <version>1.7.4</version>
    <scope>test</scope>
</dependency>
```

**TypeScript Frontend**: Use [fast-check](https://github.com/dubzzz/fast-check) for property-based testing

```json
{
  "devDependencies": {
    "fast-check": "^3.15.0"
  }
}
```

### Property Test Configuration

All property tests must:
- Run minimum 100 iterations per test (due to randomization)
- Include a comment tag referencing the design document property
- Tag format: `@Property("Feature: bri-intelligence-enhancement, Property {number}: {property_text}")`

### Backend Property Test Examples

#### Example 1: Penetration Rate Calculation (Property 48)

```java
@Property
@Label("Feature: bri-intelligence-enhancement, Property 48: Penetration Rate Formula Accuracy")
void penetrationRateCalculationIsAccurate(
    @ForAll @IntRange(min = 0, max = 1000) int acquiredMerchants,
    @ForAll @IntRange(min = 1, max = 1000) int totalMerchants
) {
    Assume.that(acquiredMerchants <= totalMerchants);
    
    TerritorialStats stats = new TerritorialStats();
    stats.setAcquiredMerchants(acquiredMerchants);
    stats.setTotalMerchants(totalMerchants);
    
    double expectedRate = (acquiredMerchants / (double) totalMerchants) * 100.0;
    double actualRate = territorialService.calculatePenetrationRate(stats);
    
    assertThat(actualRate).isCloseTo(expectedRate, within(0.01));
}
```

#### Example 2: Custom Area Spatial Query (Property 14)

```java
@Property
@Label("Feature: bri-intelligence-enhancement, Property 14: Custom Area Spatial Query Accuracy")
void customAreaReturnsOnlyMerchantsWithinBoundary(
    @ForAll("polygonGeometry") Polygon area,
    @ForAll("merchantList") List<Merchant> allMerchants
) {
    // Execute spatial query
    List<Merchant> result = geospatialService.findMerchantsInArea(area);
    
    // Verify all returned merchants are within area
    for (Merchant m : result) {
        assertThat(area.contains(m.getLocation())).isTrue();
    }
    
    // Verify no merchants within area are missing
    for (Merchant m : allMerchants) {
        if (area.contains(m.getLocation())) {
            assertThat(result).contains(m);
        }
    }
}

@Provide
Arbitrary<Polygon> polygonGeometry() {
    return Arbitraries.integers().between(-180, 180)
        .list().ofSize(4)
        .map(coords -> createValidPolygon(coords));
}

@Provide
Arbitrary<List<Merchant>> merchantList() {
    return Arbitraries.integers().between(10, 100)
        .flatMap(count -> 
            Arbitraries.of(generateRandomMerchants(count))
        );
}
```

#### Example 3: Filter Application Consistency (Property 11)

```java
@Property
@Label("Feature: bri-intelligence-enhancement, Property 11: Filter Application Consistency")
void filterApplicationAffectsAllVisualizations(
    @ForAll("administrativeArea") AdministrativeBoundary area,
    @ForAll("merchantDataset") List<Merchant> allMerchants
) {
    // Apply filter
    FilterRequest filter = new FilterRequest();
    filter.setAreaId(area.getId());
    filter.setLevel(area.getLevel());
    
    // Get filtered data for different visualizations
    HeatmapData heatmap = territorialService.generateHeatmap(
        new HeatmapRequest("penetration", filter)
    );
    List<ClusterData> clusters = territorialService.performClusterAnalysis(
        new ClusterRequest(filter)
    );
    TerritorialStats stats = territorialService.getDrillDownData(
        area.getLevel().toString(), area.getId()
    );
    
    // All visualizations should only include merchants within the filtered area
    Set<String> merchantsInArea = allMerchants.stream()
        .filter(m -> isWithinArea(m, area))
        .map(Merchant::getId)
        .collect(Collectors.toSet());
    
    // Verify heatmap only includes filtered merchants
    Set<String> heatmapMerchants = extractMerchantIds(heatmap);
    assertThat(heatmapMerchants).isSubsetOf(merchantsInArea);
    
    // Verify clusters only include filtered merchants
    Set<String> clusterMerchants = clusters.stream()
        .flatMap(c -> c.getMerchantIds().stream())
        .collect(Collectors.toSet());
    assertThat(clusterMerchants).isSubsetOf(merchantsInArea);
    
    // Verify stats match filtered data
    assertThat(stats.getTotalMerchants()).isEqualTo(merchantsInArea.size());
}
```

#### Example 4: Custom Area Persistence Round-Trip (Property 16)

```java
@Property
@Label("Feature: bri-intelligence-enhancement, Property 16: Custom Area Persistence Round-Trip")
void customAreaSaveAndLoadPreservesGeometry(
    @ForAll("customArea") CustomArea originalArea
) {
    // Save custom area
    String savedId = customAreaService.save(originalArea);
    
    // Load custom area
    CustomArea loadedArea = customAreaService.findById(savedId);
    
    // Verify geometry is spatially equivalent
    assertThat(loadedArea.getGeometry().equals(originalArea.getGeometry())).isTrue();
    
    // Verify metadata is preserved
    assertThat(loadedArea.getName()).isEqualTo(originalArea.getName());
    assertThat(loadedArea.getDescription()).isEqualTo(originalArea.getDescription());
    assertThat(loadedArea.getType()).isEqualTo(originalArea.getType());
}

@Provide
Arbitrary<CustomArea> customArea() {
    return Combinators.combine(
        Arbitraries.strings().alpha().ofLength(10),
        Arbitraries.strings().alpha().ofLength(50),
        Arbitraries.of(AreaType.values()),
        polygonGeometry()
    ).as((name, desc, type, geom) -> {
        CustomArea area = new CustomArea();
        area.setName(name);
        area.setDescription(desc);
        area.setType(type);
        area.setGeometry(geom);
        return area;
    });
}
```

### Frontend Property Test Examples

#### Example 5: Cluster Size Proportionality (Property 4)

```typescript
import fc from 'fast-check';

// Feature: bri-intelligence-enhancement, Property 4: Cluster Size Proportionality
describe('Cluster Size Proportionality', () => {
  it('should render larger clusters with greater visual radius', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          id: fc.string(),
          merchantCount: fc.integer({ min: 1, max: 100 }),
          location: fc.record({
            lat: fc.double({ min: -90, max: 90 }),
            lng: fc.double({ min: -180, max: 180 })
          })
        }), { minLength: 2, maxLength: 20 }),
        (clusters) => {
          const rendered = renderClusters(clusters);
          
          for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
              const clusterA = clusters[i];
              const clusterB = clusters[j];
              
              if (clusterA.merchantCount > clusterB.merchantCount) {
                const radiusA = rendered.getClusterRadius(clusterA.id);
                const radiusB = rendered.getClusterRadius(clusterB.id);
                
                expect(radiusA).toBeGreaterThanOrEqual(radiusB);
              }
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Example 6: Filter State Persistence (Property 12)

```typescript
// Feature: bri-intelligence-enhancement, Property 12: Filter State Persistence Across Tabs
describe('Filter State Persistence', () => {
  it('should preserve filter state when navigating between tabs', () => {
    fc.assert(
      fc.property(
        fc.record({
          provinceId: fc.string(),
          cityId: fc.option(fc.string()),
          districtId: fc.option(fc.string()),
          subdistrictId: fc.option(fc.string())
        }),
        fc.constantFrom('map', 'analytics', 'reports'),
        fc.constantFrom('map', 'analytics', 'reports'),
        (filterState, tab1, tab2) => {
          // Apply filter in tab1
          const dashboard = new Dashboard();
          dashboard.navigateToTab(tab1);
          dashboard.applyFilter(filterState);
          
          // Navigate to tab2 and back to tab1
          dashboard.navigateToTab(tab2);
          dashboard.navigateToTab(tab1);
          
          // Verify filter state is preserved
          const currentFilter = dashboard.getCurrentFilter();
          expect(currentFilter).toEqual(filterState);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Example 7: Visualization Type Selection (Property 22)

```typescript
// Feature: bri-intelligence-enhancement, Property 22: Visualization Type Selection
describe('Visualization Type Selection', () => {
  it('should select appropriate chart type based on data type', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant({ type: 'comparison', data: generateComparisonData() }),
          fc.constant({ type: 'trend', data: generateTrendData() }),
          fc.constant({ type: 'composition', data: generateCompositionData() }),
          fc.constant({ type: 'geospatial', data: generateGeospatialData() })
        ),
        (queryResult) => {
          const viz = autoGenerateVisualization(queryResult);
          
          const expectedChartType = {
            'comparison': 'bar',
            'trend': 'line',
            'composition': 'pie',
            'geospatial': 'map'
          }[queryResult.type];
          
          expect(viz.chartType).toBe(expectedChartType);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing Strategy

Unit tests should focus on:

1. **Specific Examples**: Test known input-output pairs
2. **Edge Cases**: Empty datasets, boundary values, null handling
3. **Error Conditions**: Invalid inputs, API failures, timeout scenarios
4. **Integration Points**: Component interactions, API contracts

#### Unit Test Examples

```java
@Test
void shouldHandleEmptyMerchantList() {
    List<Merchant> emptyList = Collections.emptyList();
    
    List<ClusterData> clusters = territorialService.performClusterAnalysis(
        new ClusterRequest(emptyList)
    );
    
    assertThat(clusters).isEmpty();
}

@Test
void shouldThrowExceptionForInvalidGeometry() {
    Polygon invalidPolygon = createSelfIntersectingPolygon();
    
    assertThatThrownBy(() -> 
        geospatialService.findMerchantsInArea(invalidPolygon)
    ).isInstanceOf(InvalidGeometryException.class)
     .hasMessageContaining("Geometry is not valid");
}

@Test
void shouldReturnCachedDataWhenExternalAPIFails() {
    // Setup cached data
    ExternalDataResponse cachedResponse = new ExternalDataResponse(/* ... */);
    when(cacheService.get(anyString())).thenReturn(Optional.of(cachedResponse));
    
    // Simulate API failure
    when(externalAPIClient.call(any())).thenThrow(new APIException("Service unavailable"));
    
    // Should return cached data
    ExternalDataResponse result = integrationService.fetchExternalData(request);
    
    assertThat(result).isEqualTo(cachedResponse);
    assertThat(result.isStale()).isTrue();
}
```

### Integration Testing

```java
@SpringBootTest
@AutoConfigureTestDatabase
@Testcontainers
class IntegrationTests {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgis/postgis:14-3.3")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");
    
    @Test
    void shouldSyncExternalMerchantsEndToEnd() {
        // Mock external API
        mockExternalAPI.stubMerchantDirectory(testMerchantData);
        
        // Trigger sync
        integrationService.syncMerchantDirectory();
        
        // Verify data in database
        List<ExternalMerchant> synced = externalMerchantRepository.findAll();
        assertThat(synced).hasSize(testMerchantData.size());
    }
}
```

### Performance Testing

```java
@Test
void shouldHandleLargeDatasetWithinPerformanceThreshold() {
    // Generate 10,000 merchants
    List<Merchant> largeMerchantSet = generateMerchants(10_000);
    
    StopWatch stopWatch = new StopWatch();
    stopWatch.start();
    
    HeatmapData heatmap = territorialService.generateHeatmap(
        new HeatmapRequest("penetration", largeMerchantSet)
    );
    
    stopWatch.stop();
    
    // Should complete within 2 seconds (Requirement 1.3)
    assertThat(stopWatch.getTotalTimeMillis()).isLessThan(2000);
}
```

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% line coverage
- **Property Test Coverage**: All 78 correctness properties must have corresponding property tests
- **Integration Test Coverage**: All external API integrations and critical user flows
- **E2E Test Coverage**: Key user journeys (login → filter → drill-down → export)

### Continuous Testing

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgis/postgis:14-3.3
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          
      - name: Run Unit Tests
        run: ./mvnw test
        
      - name: Run Property Tests
        run: ./mvnw test -Dtest=**/*PropertyTest
        
      - name: Run Integration Tests
        run: ./mvnw verify -P integration-tests
        
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
```

### Test Data Management

```java
@Component
public class TestDataFactory {
    
    public Merchant createRandomMerchant() {
        return Merchant.builder()
            .id(UUID.randomUUID().toString())
            .name(faker.company().name())
            .category(faker.options().option(MerchantCategory.values()))
            .location(createRandomPoint())
            .casaValue(BigDecimal.valueOf(faker.number().randomDouble(2, 1000, 1000000)))
            .acquisitionStatus(faker.options().option(AcquisitionStatus.values()))
            .build();
    }
    
    public Point createRandomPoint() {
        GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);
        double lat = faker.number().randomDouble(6, -6.5, -6.0); // Jakarta area
        double lng = faker.number().randomDouble(6, 106.5, 107.0);
        return gf.createPoint(new Coordinate(lng, lat));
    }
}
```

